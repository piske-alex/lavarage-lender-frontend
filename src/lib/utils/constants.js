// Common token addresses and configurations

export const SOLANA_TOKENS = {
	SOL: {
		address: 'So11111111111111111111111111111111111111112',
		symbol: 'SOL',
		name: 'Solana',
		decimals: 9,
		logoURI: 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/So11111111111111111111111111111111111111112/logo.png'
	},
	USDC: {
		address: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
		symbol: 'USDC',
		name: 'USD Coin',
		decimals: 6,
		logoURI: 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v/logo.png'
	},
	USDT: {
		address: 'Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB',
		symbol: 'USDT',
		name: 'Tether USD',
		decimals: 6,
		logoURI: 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB/logo.png'
	},
	BTC: {
		address: '9n4nbM75f5Ui33ZbPYXn59EwSgE8CGsHtAeTH5YFeJ9E',
		symbol: 'BTC',
		name: 'Bitcoin (Portal)',
		decimals: 8,
		logoURI: 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/9n4nbM75f5Ui33ZbPYXn59EwSgE8CGsHtAeTH5YFeJ9E/logo.png'
	},
	ETH: {
		address: '7vfCXTUXx5WJV5JADk17DUJ4ksgau7utNKj4b963voxs',
		symbol: 'ETH',
		name: 'Ethereum (Portal)',
		decimals: 8,
		logoURI: 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/7vfCXTUXx5WJV5JADk17DUJ4ksgau7utNKj4b963voxs/logo.png'
	}
};

export const BSC_TOKENS = {
	BNB: {
		address: '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c',
		symbol: 'BNB',
		name: 'BNB',
		decimals: 18
	},
	USDT: {
		address: '0x55d398326f99059fF775485246999027B3197955',
		symbol: 'USDT',
		name: 'Tether USD',
		decimals: 18
	},
	USDC: {
		address: '0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d',
		symbol: 'USDC',
		name: 'USD Coin',
		decimals: 18
	}
};

// API endpoints
export const API_ENDPOINTS = {
	LENDER_OFFERS: '/api/sdk/v1.0/lender/offers',
	LENDER_POSITIONS: '/api/sdk/v1.0/lender/positions',
	LENDER_POOL_BALANCE: '/api/sdk/v1.0/lender/pools/balance',
	CREATE_OFFER: '/api/sdk/v1.0/lender/offers/create',
	UPDATE_OFFER: '/api/sdk/v1.0/lender/offers/update',
	CHANGE_LTV: '/api/sdk/v1.0/lender/offers/changeLTV',
	DEPOSIT: '/api/sdk/v1.0/lender/pools/deposit',
	WITHDRAW: '/api/sdk/v1.0/lender/pools/withdraw'
};

// Chain configurations
export const SUPPORTED_CHAINS = {
	solana: {
		id: 'solana',
		name: 'Solana Mainnet',
		rpcUrl: 'https://api.mainnet-beta.solana.com',
		tokens: SOLANA_TOKENS
	},
	bsc: {
		id: 56,
		name: 'BNB Smart Chain',
		rpcUrl: 'https://bsc-dataseed.binance.org',
		tokens: BSC_TOKENS
	}
};

// Default values
export const DEFAULTS = {
	REFRESH_INTERVAL: 30000, // 30 seconds
	DEFAULT_SLIPPAGE: 500, // 5%
	DEFAULT_LEVERAGE: 2,
	MIN_INTEREST_RATE: 1,
	MAX_INTEREST_RATE: 1000,
	DEFAULT_QUOTE_TOKEN: SOLANA_TOKENS.SOL.address
};

// Status mappings
export const POSITION_STATUS = {
	ACTIVE: 'active',
	CLOSED: 'closed',
	LIQUIDATED: 'liquidated',
	REPAID: 'repaid',
	SOLD: 'sold'
};

export const OFFER_STATUS = {
	ACTIVE: 'active',
	INACTIVE: 'inactive'
};