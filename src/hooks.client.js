import { config } from './lib/wagmi.js';
import { configureChains } from '@wagmi/core';

// Initialize wagmi config on client side
if (typeof window !== 'undefined') {
	// Any client-side initialization can go here
	console.log('Lavarage Lender Frontend initialized');
}