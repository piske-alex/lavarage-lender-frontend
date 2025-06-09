<script>
	import { onMount } from 'svelte';
	import { isConnected, address } from '../../lib/stores/wallet.js';
	import { positions, loading, fetchLenderPositions } from '../../lib/stores/lender.js';
	import { formatCurrency, formatPercentage, formatAddress, formatDateTime, getStatusColor } from '../../lib/utils/format.js';
	import LoadingSpinner from '../../lib/components/LoadingSpinner.svelte';
	import { Users, TrendingUp, Activity, Filter } from 'lucide-svelte';

	let filterStatus = 'all'; // all, active, closed, liquidated
	let sortBy = 'openDate'; // openDate, borrowed, interest
	
	// Auto-refresh data
	onMount(() => {
		const interval = setInterval(() => {
			if ($isConnected && $address) {
				fetchLenderPositions($address, filterStatus === 'all' ? 'all' : filterStatus);
			}
		}, 30000); // Refresh every 30 seconds
		
		return () => clearInterval(interval);
	});

	// Update filter
	$: if ($isConnected && $address) {
		fetchLenderPositions($address, filterStatus === 'all' ? 'all' : filterStatus);
	}

	// Filter and sort positions
	$: filteredPositions = $positions
		.filter(position => {
			if (filterStatus === 'active') return position.status === 'active';
			if (filterStatus === 'closed') return ['closed', 'repaid', 'sold'].includes(position.status);
			if (filterStatus === 'liquidated') return position.status === 'liquidated';
			return true;
		})
		.sort((a, b) => {
			switch (sortBy) {
				case 'borrowed':
					return parseFloat(b.initialBorrowQuote || 0) - parseFloat(a.initialBorrowQuote || 0);
				case 'interest':
					return (b.interestAccrued || 0) - (a.interestAccrued || 0);
				case 'openDate':
				default:
					return new Date(b.openTimestamp) - new Date(a.openTimestamp);
			}
		});

	// Calculate totals
	$: totalBorrowed = filteredPositions.reduce((sum, pos) => sum + parseFloat(pos.initialBorrowQuote || 0), 0);
	$: totalInterest = filteredPositions.reduce((sum, pos) => sum + (pos.interestAccrued || 0), 0);
	$: activeCount = filteredPositions.filter(pos => pos.status === 'active').length;
</script>

<svelte:head>
	<title>Borrower Positions - Lavarage Lender</title>
</svelte:head>

<div class="space-y-6">
	<!-- Header -->
	<div class="flex flex-col sm:flex-row sm:items-center sm:justify-between">
		<div>
			<h1 class="text-3xl font-bold text-gray-900">Borrower Positions</h1>
			<p class="mt-2 text-gray-600">Monitor positions using your lending liquidity</p>
		</div>
	</div>

	{#if !$isConnected}
		<!-- Connect Wallet Prompt -->
		<div class="card text-center py-12">
			<div class="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
				<Users class="w-8 h-8 text-primary-600" />
			</div>
			<h2 class="text-xl font-semibold text-gray-900 mb-2">Connect Your Wallet</h2>
			<p class="text-gray-600">Connect your wallet to view borrower positions using your liquidity</p>
		</div>
	{:else}
		<!-- Summary Stats -->
		<div class="grid grid-cols-1 md:grid-cols-3 gap-6">
			<div class="card">
				<div class="flex items-center justify-between">
					<div>
						<p class="text-sm font-medium text-gray-600">Active Positions</p>
						<p class="text-2xl font-bold text-gray-900">{activeCount}</p>
					</div>
					<div class="p-3 bg-primary-100 rounded-lg">
						<Users class="w-6 h-6 text-primary-600" />
					</div>
				</div>
			</div>

			<div class="card">
				<div class="flex items-center justify-between">
					<div>
						<p class="text-sm font-medium text-gray-600">Total Borrowed</p>
						<p class="text-2xl font-bold text-gray-900">
							{formatCurrency(totalBorrowed / 1e9, 2, 'SOL')}
						</p>
					</div>
					<div class="p-3 bg-warning-100 rounded-lg">
						<Activity class="w-6 h-6 text-warning-600" />
					</div>
				</div>
			</div>

			<div class="card">
				<div class="flex items-center justify-between">
					<div>
						<p class="text-sm font-medium text-gray-600">Interest Earned</p>
						<p class="text-2xl font-bold text-success-600">
							{formatCurrency(totalInterest, 4, 'SOL')}
						</p>
					</div>
					<div class="p-3 bg-success-100 rounded-lg">
						<TrendingUp class="w-6 h-6 text-success-600" />
					</div>
				</div>
			</div>
		</div>

		<!-- Filters and Controls -->
		<div class="card">
			<div class="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
				<div class="flex space-x-4">
					<div>
						<label class="block text-sm font-medium text-gray-700 mb-1">Status</label>
						<select bind:value={filterStatus} class="input text-sm">
							<option value="all">All Positions</option>
							<option value="active">Active</option>
							<option value="closed">Closed</option>
							<option value="liquidated">Liquidated</option>
						</select>
					</div>
					<div>
						<label class="block text-sm font-medium text-gray-700 mb-1">Sort By</label>
						<select bind:value={sortBy} class="input text-sm">
							<option value="openDate">Open Date</option>
							<option value="borrowed">Amount Borrowed</option>
							<option value="interest">Interest Earned</option>
						</select>
					</div>
				</div>
				
				<div class="text-sm text-gray-600">
					{filteredPositions.length} positions
				</div>
			</div>
		</div>

		<!-- Positions List -->
		{#if $loading.positions}
			<div class="flex justify-center py-12">
				<LoadingSpinner size="lg" />
			</div>
		{:else if filteredPositions.length === 0}
			<div class="card text-center py-12">
				<div class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
					<Filter class="w-8 h-8 text-gray-400" />
				</div>
				<h3 class="text-lg font-medium text-gray-900 mb-2">
					{$positions.length === 0 ? 'No positions found' : 'No positions match your filters'}
				</h3>
				<p class="text-gray-600">
					{$positions.length === 0 
						? 'Positions will appear here when borrowers use your offers' 
						: 'Try adjusting your filters to see more positions'
					}
				</p>
			</div>
		{:else}
			<div class="space-y-4">
				{#each filteredPositions as position}
					<div class="card hover:shadow-lg transition-shadow">
						<div class="flex flex-col lg:flex-row lg:items-center lg:justify-between">
							<div class="flex-1">
								<div class="flex items-center space-x-3 mb-3">
									<div class="w-10 h-10 bg-gradient-to-r from-primary-500 to-primary-600 rounded-lg flex items-center justify-center">
										<span class="text-white font-bold text-sm">
											{position.collateralToken?.symbol?.slice(0, 2) || 'UN'}
										</span>
									</div>
									<div class="flex-1">
										<div class="flex items-center space-x-2 mb-1">
											<h3 class="font-semibold text-gray-900">
												{position.collateralToken?.name || 'Unknown Token'}
											</h3>
											<span class="badge {getStatusColor(position.status)}">
												{position.status}
											</span>
										</div>
										<p class="text-sm text-gray-500">
											Trader: {formatAddress(position.traderAddress)}
										</p>
									</div>
								</div>
								
								<div class="grid grid-cols-2 lg:grid-cols-5 gap-4">
									<div>
										<p class="text-sm text-gray-500">Borrowed</p>
										<p class="font-semibold">
											{formatCurrency(parseFloat(position.initialBorrowQuote) / 1e9, 2, 'SOL')}
										</p>
									</div>
									<div>
										<p class="text-sm text-gray-500">Interest Earned</p>
										<p class="font-semibold text-success-600">
											{formatCurrency(position.interestAccrued, 4, 'SOL')}
										</p>
									</div>
									<div>
										<p class="text-sm text-gray-500">APR</p>
										<p class="font-semibold">{formatPercentage(position.apr)}</p>
									</div>
									<div>
										<p class="text-sm text-gray-500">LTV</p>
										<p class="font-semibold">{formatPercentage(parseFloat(position.currentLtv) * 100)}</p>
									</div>
									<div>
										<p class="text-sm text-gray-500">Opened</p>
										<p class="font-semibold">{formatDateTime(position.openTimestamp)}</p>
									</div>
								</div>
							</div>
						</div>
					</div>
				{/each}
			</div>
		{/if}
	{/if}
</div>