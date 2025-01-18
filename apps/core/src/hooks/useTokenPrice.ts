// Copyright (c) Mysten Labs, Inc.
// SPDX-License-Identifier: Apache-2.0

import { useQuery } from '@tanstack/react-query';
import BigNumber from 'bignumber.js';

import { useAppsBackend } from './useAppsBackend';
import { useCoinMetadata } from './useFormatCoin';

type TokenPriceResponse = { price: string | null };

export function useTokenPrice(coinType: string) {
	const { request } = useAppsBackend();
	return useQuery({
		queryKey: ['apps-backend', 'token-price', coinType],
		queryFn: () => request<TokenPriceResponse>(`cetus/${coinType}`),

		// These values are set to one minute to prevent displaying stale data, as token prices can change frequently.
		staleTime: 60 * 1000,
		gcTime: 60 * 1000,
		refetchInterval: 5 * 1000,
		// 60 * 1000
	});
}

export function useBalanceInUSD(
	coinType: string,
	balance: bigint | string | number,
	withPrice: boolean = false,
) {
	const { data: coinMetadata } = useCoinMetadata(coinType);
	const { data: tokenPrice } = useTokenPrice(coinType);
	if (!tokenPrice || !coinMetadata || !tokenPrice.price) return null;
	return withPrice
		? `${new BigNumber(balance.toString())
				.shiftedBy(-1 * coinMetadata.decimals)
				.multipliedBy(tokenPrice.price)
				.toString()}_${tokenPrice.price}`
		: `${new BigNumber(balance.toString())
				.shiftedBy(-1 * coinMetadata.decimals)
				.multipliedBy(tokenPrice.price)
				.toNumber()}`;
}
