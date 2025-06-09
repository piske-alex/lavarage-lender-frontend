import { writable } from 'svelte/store';
import { address } from './wallet.js';

// Liquidation proceeds store
export const liquidationProceeds = writable([]);
export const liquidationLoading = writable(false);
export const liquidationError = writable(null);

// API configuration
const API_BASE_URL = import.meta.env.VITE_LAVARAGE_API_URL || 'https://api.lavarage.com';
const API_KEY = import.meta.env.VITE_LAVARAGE_API_KEY;

// API headers
const getHeaders = () => ({
	'Content-Type': 'application/json',
	'x-api-key': API_KEY
});

// Fetch liquidation proceeds for a lender
export async function fetchLiquidationProceeds(lenderWallet) {
	if (!lenderWallet) return;

	liquidationLoading.set(true);
	liquidationError.set(null);

	try {
		// Note: This endpoint doesn't exist in the current API spec
		// We're creating a mock implementation for demonstration
		// In a real implementation, this would be a proper API endpoint
		
		// Mock data for demonstration
		const mockData = [
			{
				id: '1',
				positionAddress: 'AezAHf5e6Cfiyyvu35KkWKEuZKLsEAN4XWzA36NvvCBw',
				liquidatedAt: '2024-12-01T10:30:00.000Z',
				collateralAmount: '2500000000', // 2.5 tokens
				collateralToken: {
					symbol: 'SOL',
					name: 'Solana',
					address: 'So11111111111111111111111111111111111111112'
				},
				soldFor: '2200000000', // 2.2 SOL
				pnl: '-300000000', // -0.3 SOL loss
				processingStatus: 'cooldown',
				cooldownEndTime: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString() // 2 hours from now
			},
			{
				id: '2',
				positionAddress: 'BfzXTUXx5WJV5JADk17DUJ4ksgau7utNKj4b963voxs',
				liquidatedAt: '2024-11-28T15:45:00.000Z',
				collateralAmount: '5000000000', // 5 tokens
				collateralToken: {
					symbol: 'ETH',
					name: 'Ethereum',
					address: '7vfCXTUXx5WJV5JADk17DUJ4ksgau7utNKj4b963voxs'
				},
				soldFor: '5100000000', // 5.1 SOL
				pnl: '100000000', // +0.1 SOL profit
				processingStatus: 'processing'
			},
			{
				id: '3',
				positionAddress: 'CgzHTUXx5WJV5JADk17DUJ4ksgau7utNKj4b963voxs',
				liquidatedAt: '2024-11-25T09:20:00.000Z',
				collateralAmount: '1000000000', // 1 token
				collateralToken: {
					symbol: 'BTC',
					name: 'Bitcoin',
					address: '9n4nbM75f5Ui33ZbPYXn59EwSgE8CGsHtAeTH5YFeJ9E'
				},
				soldFor: '980000000', // 0.98 SOL
				pnl: '-20000000', // -0.02 SOL loss
				processingStatus: 'deposited'
			},
			{
				id: '4',
				positionAddress: 'DhzITUXx5WJV5JADk17DUJ4ksgau7utNKj4b963voxs',
				liquidatedAt: '2024-11-20T14:15:00.000Z',
				collateralAmount: '3200000000', // 3.2 tokens
				collateralToken: {
					symbol: 'USDC',
					name: 'USD Coin',
					address: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v'
				},
				soldFor: '3350000000', // 3.35 SOL
				pnl: '150000000', // +0.15 SOL profit
				processingStatus: 'deposited'
			}
		];

		// Simulate API delay
		await new Promise(resolve => setTimeout(resolve, 500));
		
		liquidationProceeds.set(mockData);
		
	} catch (err) {
		console.error('Error fetching liquidation proceeds:', err);
		liquidationError.set(err.message);
	} finally {
		liquidationLoading.set(false);
	}
}

// Update liquidation proceed status (for real API implementation)
export async function updateLiquidationStatus(proceedId, newStatus) {
	try {
		// This would be a real API call to update liquidation status
		console.log(`Updating liquidation ${proceedId} to status: ${newStatus}`);
		
		// For now, just update the local state
		liquidationProceeds.update(proceeds => 
			proceeds.map(proceed => 
				proceed.id === proceedId 
					? { ...proceed, processingStatus: newStatus }
					: proceed
			)
		);
		
	} catch (err) {
		console.error('Error updating liquidation status:', err);
		throw err;
	}
}