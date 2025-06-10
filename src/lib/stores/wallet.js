import { writable, derived } from 'svelte/store';
import { getAccount, connect, disconnect } from '@wagmi/core';
import { browser } from '$app/environment';

// Core wallet state
export const isConnected = writable(false);
export const address = writable(null);
export const isConnecting = writable(false);
export const error = writable(null);

// Initialize wallet state on browser
if (browser) {
	const account = getAccount();
	isConnected.set(account.isConnected);
	address.set(account.address);
}

// Connect wallet function
export async function connectWallet(connector) {
	if (!browser) return;
	
	try {
		isConnecting.set(true);
		error.set(null);
		
		const result = await connect({ connector });
		
		if (result.account) {
			isConnected.set(true);
			address.set(result.account);
		}
	} catch (err) {
		console.error('Wallet connection failed:', err);
		error.set(err.message || 'Connection failed');
		isConnected.set(false);
		address.set(null);
	} finally {
		isConnecting.set(false);
	}
}

// Disconnect wallet function
export async function disconnectWallet() {
	if (!browser) return;
	
	try {
		await disconnect();
		isConnected.set(false);
		address.set(null);
		error.set(null);
	} catch (err) {
		console.error('Wallet disconnection failed:', err);
		error.set(err.message || 'Disconnection failed');
	}
}

// Derived stores
export const shortAddress = derived(address, ($address) => {
	if (!$address) return null;
	return `${$address.slice(0, 6)}...${$address.slice(-4)}`;
});

// Auto-reconnect on page load
if (browser) {
	const account = getAccount();
	if (account.isConnected) {
		isConnected.set(true);
		address.set(account.address);
	}
}
