import { writable, derived } from 'svelte/store';
import { address } from './wallet.js';

// Lender data stores
export const offers = writable([]);
export const positions = writable([]);
export const poolBalance = writable(null);
export const loading = writable({
	offers: false,
	positions: false,
	poolBalance: false
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

// Fetch pool balance
export async function fetchPoolBalance(userWallet, quoteToken) {
	if (!userWallet || !quoteToken) return;

	loading.update((l) => ({ ...l, poolBalance: true }));
	error.set(null);

	try {
		const response = await fetch(
			`${API_BASE_URL}/api/sdk/v1.0/lender/pools/balance?userWallet=${userWallet}&quoteToken=${quoteToken}`,
			{ headers: getHeaders() }
		);

		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`);
		}

		const data = await response.json();
		poolBalance.set(data);
	} catch (err) {
		console.error('Error fetching pool balance:', err);
		error.set(err.message);
	} finally {
		loading.update((l) => ({ ...l, poolBalance: false }));
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

// Update offer
export async function updateOffer(offerData) {
	try {
		const response = await fetch(`${API_BASE_URL}/api/sdk/v1.0/lender/offers/update`, {
			method: 'PUT',
			headers: getHeaders(),
			body: JSON.stringify(offerData)
		});

		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`);
		}

		return await response.json();
	} catch (err) {
		console.error('Error updating offer:', err);
		throw err;
	}
}

// Change LTV
export async function changeLTV(ltvData) {
	try {
		const response = await fetch(`${API_BASE_URL}/api/sdk/v1.0/lender/offers/changeLTV`, {
			method: 'PUT',
			headers: getHeaders(),
			body: JSON.stringify(ltvData)
		});

		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`);
		}

		return await response.json();
	} catch (err) {
		console.error('Error changing LTV:', err);
		throw err;
	}
}

// Create deposit transaction
export async function createDepositTransaction(depositData) {
	try {
		const response = await fetch(`${API_BASE_URL}/api/sdk/v1.0/lender/pools/deposit`, {
			method: 'POST',
			headers: getHeaders(),
			body: JSON.stringify(depositData)
		});

		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`);
		}

		return await response.json();
	} catch (err) {
		console.error('Error creating deposit transaction:', err);
		throw err;
	}
}

// Create withdrawal transaction
export async function createWithdrawalTransaction(withdrawData) {
	try {
		const response = await fetch(`${API_BASE_URL}/api/sdk/v1.0/lender/pools/withdraw`, {
			method: 'POST',
			headers: getHeaders(),
			body: JSON.stringify(withdrawData)
		});

		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`);
		}

		return await response.json();
	} catch (err) {
		console.error('Error creating withdrawal transaction:', err);
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