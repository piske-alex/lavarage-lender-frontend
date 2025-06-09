// Utility functions for formatting data

// Format currency amounts
export function formatCurrency(amount, decimals = 2, currency = 'USD') {
	if (!amount && amount !== 0) return '—';
	
	const num = typeof amount === 'string' ? parseFloat(amount) : amount;
	
	if (currency === 'SOL') {
		return `${num.toFixed(decimals)} SOL`;
	}
	
	if (currency === 'USDC') {
		return `$${num.toLocaleString('en-US', { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}`;
	}
	
	return `$${num.toLocaleString('en-US', { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}`;
}

// Format percentage
export function formatPercentage(value, decimals = 2) {
	if (!value && value !== 0) return '—';
	
	const num = typeof value === 'string' ? parseFloat(value) : value;
	return `${num.toFixed(decimals)}%`;
}

// Format wallet address
export function formatAddress(address, start = 6, end = 4) {
	if (!address) return '';
	
	if (address.length <= start + end) return address;
	
	return `${address.slice(0, start)}...${address.slice(-end)}`;
}

// Format token amount with proper decimals
export function formatTokenAmount(amount, decimals = 6, symbol = '') {
	if (!amount && amount !== 0) return '—';
	
	const divisor = Math.pow(10, decimals);
	const formatted = (parseInt(amount) / divisor).toFixed(2);
	
	return symbol ? `${formatted} ${symbol}` : formatted;
}

// Format date
export function formatDate(timestamp) {
	if (!timestamp) return '—';
	
	const date = new Date(timestamp);
	return date.toLocaleDateString('en-US', {
		year: 'numeric',
		month: 'short',
		day: 'numeric'
	});
}

// Format date and time
export function formatDateTime(timestamp) {
	if (!timestamp) return '—';
	
	const date = new Date(timestamp);
	return date.toLocaleString('en-US', {
		year: 'numeric',
		month: 'short',
		day: 'numeric',
		hour: '2-digit',
		minute: '2-digit'
	});
}

// Format time ago
export function formatTimeAgo(timestamp) {
	if (!timestamp) return '—';
	
	const now = new Date();
	const date = new Date(timestamp);
	const diffMs = now - date;
	
	const diffMins = Math.floor(diffMs / 60000);
	const diffHours = Math.floor(diffMins / 60);
	const diffDays = Math.floor(diffHours / 24);
	
	if (diffMins < 60) return `${diffMins}m ago`;
	if (diffHours < 24) return `${diffHours}h ago`;
	if (diffDays < 7) return `${diffDays}d ago`;
	
	return formatDate(timestamp);
}

// Get status color class
export function getStatusColor(status) {
	switch (status?.toLowerCase()) {
		case 'active':
		case 'open':
			return 'text-success-600 bg-success-100';
		case 'closed':
		case 'repaid':
			return 'text-gray-600 bg-gray-100';
		case 'liquidated':
			return 'text-error-600 bg-error-100';
		case 'sold':
			return 'text-warning-600 bg-warning-100';
		default:
			return 'text-gray-600 bg-gray-100';
	}
}

// Calculate APY from APR
export function calculateAPY(apr, compoundingFrequency = 365) {
	const rate = apr / 100;
	return ((1 + rate / compoundingFrequency) ** compoundingFrequency - 1) * 100;
}

// Calculate utilization rate
export function calculateUtilizationRate(currentExposure, maxExposure) {
	if (!maxExposure || maxExposure === 0) return 0;
	return (currentExposure / maxExposure) * 100;
}