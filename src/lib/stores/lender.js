import { writable, derived } from 'svelte/store';
import { address } from './wallet.js';

// Lender data stores
export const offers = writable([]);
export const positions = writable([]);
export const poolBalance = writable(null);
export const liquidationProceeds = writable([]);
export const loading = writable({
	offers: false,
	positions: false,
	poolBalance: false,
	liquidationProceeds: false
});
export const error = writable(null);

// API configuration
const API_BASE_URL = import.meta.env.VITE_LAVARAGE_API_URL || 'https://api.lavarage.com';
const API_KEY = import.meta.env.VITE_LAVARAGE_API_KEY;

// API headers
const getHeaders = () => ({
	'Content-Type': 'application/json',
	'x-api-key': API_KEY
});

// Fetch liquidation proceeds
export async function fetchLiquidationProceeds(lenderWallet) {
	if (!lenderWallet) return;

	loading.update((l) => ({ ...l, liquidationProceeds: true }));
	error.set(null);

	try {
		// Mock data for demonstration since this endpoint doesn't exist in the API spec
		const mockData = [
			{
				id: '1',
				positionAddress: 'AezAHf5e6Cfiyyvu35KkWKEuZKLsEAN4XWzA36NvvCBw',
				liquidatedAt: '2024-12-01T10:30:00.000Z',
				collateralAmount: '2500000000',
				collateralToken: { symbol: 'SOL', name: 'Solana' },
				soldFor: '2200000000',
				pnl: '-300000000',
				processingStatus: 'cooldown',
				cooldownEndTime: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString()
			},
			{
				id: '2',
				positionAddress: 'BfzXTUXx5WJV5JADk17DUJ4ksgau7utNKj4b963voxs',
				liquidatedAt: '2024-11-28T15:45:00.000Z',
				collateralAmount: '5000000000',
				collateralToken: { symbol: 'ETH', name: 'Ethereum' },
				soldFor: '5100000000',
				pnl: '100000000',
				processingStatus: 'processing'
			},
			{
				id: '3',
				positionAddress: 'CgzHTUXx5WJV5JADk17DUJ4ksgau7utNKj4b963voxs',
				liquidatedAt: '2024-11-25T09:20:00.000Z',
				collateralAmount: '1000000000',
				collateralToken: { symbol: 'BTC', name: 'Bitcoin' },
				soldFor: '980000000',
				pnl: '-20000000',
				processingStatus: 'deposited'
			}
		];

		await new Promise(resolve => setTimeout(resolve, 500));
		liquidationProceeds.set(mockData);
	} catch (err) {
		console.error('Error fetching liquidation proceeds:', err);
		error.set(err.message);
	} finally {
		loading.update((l) => ({ ...l, liquidationProceeds: false }));
	}
}

// Fetch lender offers
export async function fetchLenderOffers(lenderWallet) {
	if (!lenderWallet) return;

	loading.update((l) => ({ ...l, offers: true }));
	error.set(null);

	try {
		const response = await fetch(
			`${API_BASE_URL}/api/sdk/v1.0/lender/offers?lenderWallet=${lenderWallet}&includeRawData=true`,
			{ headers: getHeaders() }
		);

		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`);
		}

		const data = await response.json();
		offers.set(data);
	} catch (err) {
		console.error('Error fetching lender offers:', err);
		error.set(err.message);
	} finally {
		loading.update((l) => ({ ...l, offers: false }));
	}
}

// Fetch lender positions
export async function fetchLenderPositions(lenderWallet, status = 'all') {
	if (!lenderWallet) return;

	loading.update((l) => ({ ...l, positions: true }));
	error.set(null);

	try {
		const response = await fetch(
			`${API_BASE_URL}/api/sdk/v1.0/lender/positions?lenderWallet=${lenderWallet}&status=${status}`,
			{ headers: getHeaders() }
		);

		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`);
		}

		const data = await response.json();
		positions.set(data);
	} catch (err) {
		console.error('Error fetching lender positions:', err);
		error.set(err.message);
	} finally {
		loading.update((l) => ({ ...l, positions: false }));
	}
}

// Create new offer
export async function createOffer(offerData) {
	try {
		const response = await fetch(`${API_BASE_URL}/api/sdk/v1.0/lender/offers/create`, {
			method: 'POST',
			headers: getHeaders(),
			body: JSON.stringify(offerData)
		});

		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`);
		}

		return await response.json();
	} catch (err) {
		console.error('Error creating offer:', err);
		throw err;
	}
}

// Derived stores
export const totalActiveOffers = derived(offers, ($offers) => 
	$offers.filter(offer => offer.active).length
);

export const totalLiquidity = derived(offers, ($offers) => 
	$offers.reduce((total, offer) => total + parseFloat(offer.maxExposure || 0), 0)
);

export const totalUtilization = derived(offers, ($offers) => 
	$offers.reduce((total, offer) => total + parseFloat(offer.currentExposure || 0), 0)
);

export const activePositions = derived(positions, ($positions) => 
	$positions.filter(position => position.status === 'active')
);