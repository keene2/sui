// Copyright (c) Mysten Labs, Inc.
// SPDX-License-Identifier: Apache-2.0

export enum AppType {
	unknown,
	fullscreen,
	popup,
	sidepanel,
}

export function getFromLocationSearch(search: string) {
	const pathname = window.location.pathname;
	if (pathname.includes('sidepanel.html')) {
		return AppType.sidepanel;
	} else if (pathname.includes('ui.html')) {
		return AppType.popup;
	}
	return AppType.fullscreen;
}
