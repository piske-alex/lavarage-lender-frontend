<script>
	import { onMount } from 'svelte';
	import { isConnected, address } from '../../lib/stores/wallet.js';
	import { liquidationProceeds, loading, fetchLiquidationProceeds } from '../../lib/stores/lender.js';
	import { formatCurrency, formatAddress, formatDateTime, formatTimeRemaining } from '../../lib/utils/format.js';
	import LoadingSpinner from '../../lib/components/LoadingSpinner.svelte';
	import { Zap, Clock, CheckCircle, AlertCircle, Filter, TrendingDown } from 'lucide-svelte';

	let filterStatus = 'all'; // all, cooldown, processing, deposited
	let sortBy = 'liquidatedAt'; // liquidatedAt, pnl, collateralAmount
	let sortOrder = 'desc'; // asc, desc
	
	// Auto-refresh data
	onMount(() => {
		const interval = setInterval(() => {
			if ($isConnected && $address) {
				fetchLiquidationProceeds($address);
			}
		}, 10000); // Refresh every 10 seconds for cooldown timers
		
		return () => clearInterval(interval);
	});

	// Filter and sort liquidation proceeds
	$: filteredProceeds = $liquidationProceeds
		.filter(proceed => {
			if (filterStatus === 'all') return true;
			return proceed.processingStatus === filterStatus;
		})
		.sort((a, b) => {
			let aVal, bVal;
			
			switch (sortBy) {
				case 'pnl':
					aVal = parseFloat(a.pnl || 0);
					bVal = parseFloat(b.pnl || 0);
					break;
				case 'collateralAmount':
					aVal = parseFloat(a.collateralAmount || 0);
					bVal = parseFloat(b.collateralAmount || 0);
					break;
				case 'liquidatedAt':
				default:
					aVal = new Date(a.liquidatedAt);
					bVal = new Date(b.liquidatedAt);
					break;
			}
			
			return sortOrder === 'desc' ? bVal - aVal : aVal - bVal;
		});

	// Calculate summary stats
	$: totalProceeds = filteredProceeds.reduce((sum, p) => sum + parseFloat(p.soldFor || 0), 0);
	$: totalPnL = filteredProceeds.reduce((sum, p) => sum + parseFloat(p.pnl || 0), 0);
	$: cooldownCount = filteredProceeds.filter(p => p.processingStatus === 'cooldown').length;
	$: processingCount = filteredProceeds.filter(p => p.processingStatus === 'processing').length;
	$: depositedCount = filteredProceeds.filter(p => p.processingStatus === 'deposited').length;

	function getStatusIcon(status) {
		switch (status) {
			case 'cooldown': return Clock;
			case 'processing': return Zap;
			case 'deposited': return CheckCircle;
			default: return AlertCircle;
		}
	}

	function getStatusColor(status) {
		switch (status) {
			case 'cooldown': return 'text-warning-600 bg-warning-100';
			case 'processing': return 'text-primary-600 bg-primary-100';
			case 'deposited': return 'text-success-600 bg-success-100';
			default: return 'text-gray-600 bg-gray-100';
		}
	}

	function getPnLColor(pnl) {
		const value = parseFloat(pnl || 0);
		if (value > 0) return 'text-success-600';
		if (value < 0) return 'text-error-600';
		return 'text-gray-600';
	}

	function toggleSort(newSortBy) {
		if (sortBy === newSortBy) {
			sortOrder = sortOrder === 'desc' ? 'asc' : 'desc';
		} else {
			sortBy = newSortBy;
			sortOrder = 'desc';
		}
	}
</script>

<svelte:head>
	<title>Liquidation Proceeds - Lavarage Lender</title>
</svelte:head>