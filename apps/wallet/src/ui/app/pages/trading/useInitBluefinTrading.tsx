// Copyright (c) Mysten Labs, Inc.
// SPDX-License-Identifier: Apache-2.0

import { useActiveAccount } from '_app/hooks/useActiveAccount';
import { BluefinClient, Networks } from '@bluefin-exchange/bluefin-v2-client';
import { useCallback, useEffect, useState } from 'react';

// 全局单例管理
class BluefinInstance {
	private static instance: BluefinClient | null = null;
	private static initializing: boolean = false;
	private static initPromise: Promise<BluefinClient> | null = null;

	static async getInstance(address: string): Promise<BluefinClient> {
		if (this.instance?.getPublicAddress() === address) {
			return this.instance;
		}

		if (this.initializing) {
			return this.initPromise!;
		}

		this.initializing = true;
		this.initPromise = new Promise(async (resolve, reject) => {
			try {
				const client = new BluefinClient(true, Networks.TESTNET_SUI, address, 'ED25519');
				await client.init();
				this.instance = client;
				resolve(client);
			} catch (error) {
				reject(error);
			} finally {
				this.initializing = false;
				this.initPromise = null;
			}
		});

		return this.initPromise;
	}
}

// Hook
export function useBluefinClient() {
	const activeAccount = useActiveAccount();
	const [state, setState] = useState({
		client: null as BluefinClient | null,
		loading: true,
		balance: '0',
		error: null as Error | null,
	});

	const initClient = useCallback(async () => {
		debugger;
		console.log('initClient: ', activeAccount?.address);

		if (!activeAccount?.address) return;

		try {
			const client = await BluefinInstance.getInstance(activeAccount.address);
			const balance = await client.getUSDCBalance();

			setState({
				client,
				loading: false,
				balance: balance.toString(),
				error: null,
			});
		} catch (error) {
			setState((prev) => ({
				...prev,
				loading: false,
				error: error as Error,
			}));
		}
	}, [activeAccount?.address]);

	const refreshBalance = useCallback(async () => {
		if (!state.client) return;
		try {
			const balance = await state.client.getUSDCBalance();
			setState((prev) => ({ ...prev, balance: balance.toString() }));
		} catch (error) {
			console.error('Failed to refresh balance:', error);
		}
	}, [state.client]);

	useEffect(() => {
		initClient();
	}, [initClient]);

	return {
		...state,
		refreshBalance,
	};
}
