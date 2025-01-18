// Copyright (c) Mysten Labs, Inc.
// SPDX-License-Identifier: Apache-2.0

import { useActiveAccount } from '_app/hooks/useActiveAccount';
import LoadingIndicator from '_components/loading/LoadingIndicator';
// import { Text } from '_app/shared/text';
import { Text } from '_src/ui/app/shared/text';
import { BluefinClient, Networks } from '@bluefin-exchange/bluefin-v2-client';
import { useEffect, useState } from 'react';

import { useBluefinClient } from './useInitBluefinTrading';

export function BluefinTrading() {
	// return <div>BluefinTrading</div>;
	const { client, loading, balance, error, refreshBalance } = useBluefinClient();
	// { loading: true };

	if (loading) {
		return <LoadingIndicator />;
	}

	return (
		<div className="flex flex-col gap-4 p-4">
			<Text variant="heading3" weight="semibold">
				Bluefin Trading
			</Text>

			<div className="rounded-lg bg-gray-50 p-4">
				<Text variant="body" weight="medium">
					USDC Balance: {123123}
				</Text>
			</div>

			{/* 这里可以添加交易表单 */}
		</div>
	);
}
