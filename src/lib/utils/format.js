/**
 * Format a wallet address for display
 * @param {string} address - The full wallet address
 * @param {number} startChars - Number of characters to show at start
 * @param {number} endChars - Number of characters to show at end
 * @returns {string} - Formatted address
 */
export function formatAddress(address, startChars = 6, endChars = 4) {
	if (!address) return '';
	if (address.length <= startChars + endChars) return address;
	return `${address.slice(0, startChars)}...${address.slice(-endChars)}`;
}

/**
 * Format a number with appropriate decimal places
 * @param {number|string} value - The number to format
 * @param {number} decimals - Number of decimal places
 * @param {object} options - Formatting options
 * @returns {string} - Formatted number
 */
export function formatNumber(value, decimals = 2, options = {}) {
	const {
		minDecimals = decimals,
		maxDecimals = decimals,
		locale = 'en-US',
		currency = null,
		compact = false
	} = options;

	const num = parseFloat(value);
	if (isNaN(num)) return '0';

	const formatter = new Intl.NumberFormat(locale, {
		minimumFractionDigits: minDecimals,
		maximumFractionDigits: maxDecimals,
		style: currency ? 'currency' : 'decimal',
		currency: currency,
		notation: compact ? 'compact' : 'standard'
	});

	return formatter.format(num);
}

/**
 * Format a token amount with proper decimals
 * @param {string|number} amount - Raw token amount
 * @param {number} tokenDecimals - Token decimal places
 * @param {number} displayDecimals - Display decimal places
 * @returns {string} - Formatted token amount
 */
export function formatTokenAmount(amount, tokenDecimals = 18, displayDecimals = 4) {
	if (!amount) return '0';
	const divisor = Math.pow(10, tokenDecimals);
	const value = parseFloat(amount) / divisor;
	return formatNumber(value, displayDecimals);
}

/**
 * Format a percentage
 * @param {number} value - The percentage value (0-100)
 * @param {number} decimals - Number of decimal places
 * @returns {string} - Formatted percentage
 */
export function formatPercentage(value, decimals = 2) {
	if (value === null || value === undefined || isNaN(value)) return '0%';
	return `${formatNumber(value, decimals)}%`;
}

/**
 * Format a large number with K, M, B suffixes
 * @param {number} value - The number to format
 * @param {number} decimals - Number of decimal places
 * @returns {string} - Formatted number with suffix
 */
export function formatCompactNumber(value, decimals = 1) {
	return formatNumber(value, decimals, { compact: true });
}

/**
 * Format a date for display
 * @param {string|Date} date - The date to format
 * @param {object} options - Formatting options
 * @returns {string} - Formatted date
 */
export function formatDate(date, options = {}) {
	if (!date) return '';
	
	const {
		locale = 'en-US',
		dateStyle = 'medium',
		timeStyle = 'short',
		showTime = true
	} = options;

	const dateObj = typeof date === 'string' ? new Date(date) : date;
	if (isNaN(dateObj.getTime())) return '';

	return new Intl.DateTimeFormat(locale, {
		dateStyle,
		timeStyle: showTime ? timeStyle : undefined
	}).format(dateObj);
}

/**
 * Format time ago (e.g., "2 hours ago")
 * @param {string|Date} date - The date to compare
 * @returns {string} - Time ago string
 */
export function formatTimeAgo(date) {
	if (!date) return '';
	
	const dateObj = typeof date === 'string' ? new Date(date) : date;
	if (isNaN(dateObj.getTime())) return '';

	const now = new Date();
	const diffMs = now.getTime() - dateObj.getTime();
	const diffMins = Math.floor(diffMs / 60000);
	const diffHours = Math.floor(diffMins / 60);
	const diffDays = Math.floor(diffHours / 24);

	if (diffMins < 1) return 'Just now';
	if (diffMins < 60) return `${diffMins} minute${diffMins === 1 ? '' : 's'} ago`;
	if (diffHours < 24) return `${diffHours} hour${diffHours === 1 ? '' : 's'} ago`;
	if (diffDays < 30) return `${diffDays} day${diffDays === 1 ? '' : 's'} ago`;
	
	return formatDate(dateObj, { showTime: false });
}

/**
 * Format duration in human readable format
 * @param {number} seconds - Duration in seconds
 * @returns {string} - Formatted duration
 */
export function formatDuration(seconds) {
	if (!seconds || seconds < 0) return '0s';
	
	const days = Math.floor(seconds / 86400);
	const hours = Math.floor((seconds % 86400) / 3600);
	const minutes = Math.floor((seconds % 3600) / 60);
	const secs = Math.floor(seconds % 60);

	const parts = [];
	if (days > 0) parts.push(`${days}d`);
	if (hours > 0) parts.push(`${hours}h`);
	if (minutes > 0) parts.push(`${minutes}m`);
	if (secs > 0 || parts.length === 0) parts.push(`${secs}s`);

	return parts.slice(0, 2).join(' ');
}

/**
 * Format a dollar amount
 * @param {number} value - The dollar amount
 * @param {number} decimals - Number of decimal places
 * @returns {string} - Formatted dollar amount
 */
export function formatUSD(value, decimals = 2) {
	return formatNumber(value, decimals, { currency: 'USD' });
}

/**
 * Format APR/APY percentage
 * @param {number} value - The percentage value
 * @param {number} decimals - Number of decimal places
 * @returns {string} - Formatted APR/APY
 */
export function formatAPR(value, decimals = 2) {
	return formatPercentage(value, decimals);
}

/**
 * Truncate text with ellipsis
 * @param {string} text - The text to truncate
 * @param {number} maxLength - Maximum length
 * @returns {string} - Truncated text
 */
export function truncateText(text, maxLength = 50) {
	if (!text || text.length <= maxLength) return text;
	return `${text.slice(0, maxLength)}...`;
}

/**
 * Format transaction hash for display
 * @param {string} hash - The transaction hash
 * @returns {string} - Formatted hash
 */
export function formatTxHash(hash) {
	return formatAddress(hash, 8, 6);
}

/**
 * Format file size in bytes to human readable
 * @param {number} bytes - File size in bytes
 * @param {number} decimals - Number of decimal places
 * @returns {string} - Formatted file size
 */
export function formatFileSize(bytes, decimals = 2) {
	if (bytes === 0) return '0 Bytes';
	
	const k = 1024;
	const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
	const i = Math.floor(Math.log(bytes) / Math.log(k));
	
	return `${parseFloat((bytes / Math.pow(k, i)).toFixed(decimals))} ${sizes[i]}`;
}
