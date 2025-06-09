<script>
	import { onMount } from 'svelte';
	import { isConnected, address } from '../../lib/stores/wallet.js';
	import { liquidationProceeds, loading, fetchLiquidationProceeds } from '../../lib/stores/lender.js';
	import { formatCurrency, formatAddress, formatDateTime, formatTimeRemaining } from '../../lib/utils/format.js';
	import LoadingSpinner from '../../lib/components/LoadingSpinner.svelte';
	import { Zap, Clock, CheckCircle, AlertCircle, Filter, TrendingDown } from 'lucide-svelte';

	let filterStatus = 'all';
	let sortBy = 'liquidatedAt';
	let sortOrder = 'desc';
	
	onMount(() => {
		const interval = setInterval(() => {
			if ($isConnected && $address) {
				fetchLiquidationProceeds($address);
			}
		}, 10000);
		return () => clearInterval(interval);
	});

	$: filteredProceeds = $liquidationProceeds
		.filter(proceed => filterStatus === 'all' || proceed.processingStatus === filterStatus)
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
				default:
					aVal = new Date(a.liquidatedAt);
					bVal = new Date(b.liquidatedAt);
			}
			return sortOrder === 'desc' ? bVal - aVal : aVal - bVal;
		});

	$: totalProceeds = filteredProceeds.reduce((sum, p) => sum + parseFloat(p.soldFor || 0), 0);
	$: totalPnL = filteredProceeds.reduce((sum, p) => sum + parseFloat(p.pnl || 0), 0);
	$: cooldownCount = filteredProceeds.filter(p => p.processingStatus === 'cooldown').length;
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

<div class="space-y-6">
	<div class="flex flex-col sm:flex-row sm:items-center sm:justify-between">
		<div>
			<h1 class="text-3xl font-bold text-gray-900">Liquidation Proceeds</h1>
			<p class="mt-2 text-gray-600">Track liquidated positions and their processing status</p>
		</div>
	</div>

	{#if !$isConnected}
		<div class="card text-center py-12">
			<div class="w-16 h-16 bg-warning-100 rounded-full flex items-center justify-center mx-auto mb-4">
				<TrendingDown class="w-8 h-8 text-warning-600" />
			</div>
			<h2 class="text-xl font-semibold text-gray-900 mb-2">Connect Your Wallet</h2>
			<p class="text-gray-600">Connect your wallet to view liquidation proceeds</p>
		</div>
	{:else}
		<!-- Summary Stats -->
		<div class="grid grid-cols-1 md:grid-cols-4 gap-6">
			<div class="card">
				<div class="flex items-center justify-between">
					<div>
						<p class="text-sm font-medium text-gray-600">Total Proceeds</p>
						<p class="text-2xl font-bold text-gray-900">
							{formatCurrency(totalProceeds / 1e9, 2, 'SOL')}
						</p>
					</div>
					<div class="p-3 bg-primary-100 rounded-lg">
						<TrendingDown class="w-6 h-6 text-primary-600" />
					</div>
				</div>
			</div>

			<div class="card">
				<div class="flex items-center justify-between">
					<div>
						<p class="text-sm font-medium text-gray-600">Net PnL</p>
						<p class="text-2xl font-bold {getPnLColor(totalPnL)}">
							{totalPnL >= 0 ? '+' : ''}{formatCurrency(totalPnL / 1e9, 4, 'SOL')}
						</p>
					</div>
					<div class="p-3 {totalPnL >= 0 ? 'bg-success-100' : 'bg-error-100'} rounded-lg">
						<TrendingDown class="w-6 h-6 {totalPnL >= 0 ? 'text-success-600' : 'text-error-600'}" />
					</div>
				</div>
			</div>

			<div class="card">
				<div class="flex items-center justify-between">
					<div>
						<p class="text-sm font-medium text-gray-600">In Cooldown</p>
						<p class="text-2xl font-bold text-warning-600">{cooldownCount}</p>
					</div>
					<div class="p-3 bg-warning-100 rounded-lg">
						<Clock class="w-6 h-6 text-warning-600" />
					</div>
				</div>
			</div>

			<div class="card">
				<div class="flex items-center justify-between">
					<div>
						<p class="text-sm font-medium text-gray-600">Deposited</p>
						<p class="text-2xl font-bold text-success-600">{depositedCount}</p>
					</div>
					<div class="p-3 bg-success-100 rounded-lg">
						<CheckCircle class="w-6 h-6 text-success-600" />
					</div>
				</div>
			</div>
		</div>

		<!-- Filters -->
		<div class="card">
			<div class="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
				<div class="flex space-x-4">
					<div>
						<label class="block text-sm font-medium text-gray-700 mb-1">Status</label>
						<select bind:value={filterStatus} class="input text-sm">
							<option value="all">All Status</option>
							<option value="cooldown">Cooldown</option>
							<option value="processing">Processing</option>
							<option value="deposited">Deposited</option>
						</select>
					</div>
				</div>
				<div class="text-sm text-gray-600">
					{filteredProceeds.length} liquidation proceeds
				</div>
			</div>
		</div>

		{#if $loading.liquidationProceeds}
			<div class="flex justify-center py-12">
				<LoadingSpinner size="lg" />
			</div>
		{:else if filteredProceeds.length === 0}
			<div class="card text-center py-12">
				<div class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
					<Filter class="w-8 h-8 text-gray-400" />
				</div>
				<h3 class="text-lg font-medium text-gray-900 mb-2">
					{$liquidationProceeds.length === 0 ? 'No liquidations found' : 'No liquidations match your filters'}
				</h3>
				<p class="text-gray-600">
					{$liquidationProceeds.length === 0 
						? 'Liquidation proceeds will appear here when positions are liquidated' 
						: 'Try adjusting your filters to see more liquidations'
					}
				</p>
			</div>
		{:else}
			<!-- Desktop Table -->
			<div class="hidden md:block card overflow-hidden">
				<table class="min-w-full divide-y divide-gray-200">
					<thead class="bg-gray-50">
						<tr>
							<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Position</th>
							<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer" on:click={() => toggleSort('liquidatedAt')}>
								Liquidated At {#if sortBy === 'liquidatedAt'}<span class="ml-1">{sortOrder === 'desc' ? '↓' : '↑'}</span>{/if}
							</th>
							<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer" on:click={() => toggleSort('collateralAmount')}>
								Collateral Amount {#if sortBy === 'collateralAmount'}<span class="ml-1">{sortOrder === 'desc' ? '↓' : '↑'}</span>{/if}
							</th>
							<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Sold For</th>
							<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer" on:click={() => toggleSort('pnl')}>
								PnL {#if sortBy === 'pnl'}<span class="ml-1">{sortOrder === 'desc' ? '↓' : '↑'}</span>{/if}
							</th>
							<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
						</tr>
					</thead>
					<tbody class="bg-white divide-y divide-gray-200">
						{#each filteredProceeds as proceed}
							<tr class="hover:bg-gray-50">
								<td class="px-6 py-4 whitespace-nowrap">
									<div class="flex items-center">
										<div class="w-8 h-8 bg-gradient-to-r from-error-500 to-error-600 rounded-lg flex items-center justify-center mr-3">
											<TrendingDown class="w-4 h-4 text-white" />
										</div>
										<div>
											<div class="text-sm font-medium text-gray-900">{formatAddress(proceed.positionAddress)}</div>
											<div class="text-sm text-gray-500">{proceed.collateralToken?.symbol || 'Unknown'}</div>
										</div>
									</div>
								</td>
								<td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatDateTime(proceed.liquidatedAt)}</td>
								<td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
									{formatCurrency(parseFloat(proceed.collateralAmount) / 1e9, 4, proceed.collateralToken?.symbol || 'SOL')}
								</td>
								<td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
									{formatCurrency(parseFloat(proceed.soldFor) / 1e9, 2, 'SOL')}
								</td>
								<td class="px-6 py-4 whitespace-nowrap text-sm font-medium {getPnLColor(proceed.pnl)}">
									{parseFloat(proceed.pnl) >= 0 ? '+' : ''}{formatCurrency(parseFloat(proceed.pnl) / 1e9, 4, 'SOL')}
								</td>
								<td class="px-6 py-4 whitespace-nowrap">
									<div class="flex items-center space-x-2">
										<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium {getStatusColor(proceed.processingStatus)}">
											<svelte:component this={getStatusIcon(proceed.processingStatus)} class="w-3 h-3 mr-1" />
											{proceed.processingStatus}
										</span>
										{#if proceed.processingStatus === 'cooldown' && proceed.cooldownEndTime}
											<span class="text-xs text-gray-500">{formatTimeRemaining(proceed.cooldownEndTime)}</span>
										{/if}
									</div>
								</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>

			<!-- Mobile Cards -->
			<div class="md:hidden space-y-4">
				{#each filteredProceeds as proceed}
					<div class="card">
						<div class="flex items-center space-x-3 mb-3">
							<div class="w-10 h-10 bg-gradient-to-r from-error-500 to-error-600 rounded-lg flex items-center justify-center">
								<TrendingDown class="w-5 h-5 text-white" />
							</div>
							<div class="flex-1">
								<h3 class="font-semibold text-gray-900">{formatAddress(proceed.positionAddress)}</h3>
								<p class="text-sm text-gray-500">{proceed.collateralToken?.symbol || 'Unknown'} • {formatDateTime(proceed.liquidatedAt)}</p>
							</div>
							<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium {getStatusColor(proceed.processingStatus)}">
								<svelte:component this={getStatusIcon(proceed.processingStatus)} class="w-3 h-3 mr-1" />
								{proceed.processingStatus}
							</span>
						</div>
						<div class="grid grid-cols-2 gap-4">
							<div>
								<p class="text-sm text-gray-500">Collateral Amount</p>
								<p class="font-semibold">{formatCurrency(parseFloat(proceed.collateralAmount) / 1e9, 4, proceed.collateralToken?.symbol || 'SOL')}</p>
							</div>
							<div>
								<p class="text-sm text-gray-500">Sold For</p>
								<p class="font-semibold">{formatCurrency(parseFloat(proceed.soldFor) / 1e9, 2, 'SOL')}</p>
							</div>
							<div>
								<p class="text-sm text-gray-500">PnL</p>
								<p class="font-semibold {getPnLColor(proceed.pnl)}">{parseFloat(proceed.pnl) >= 0 ? '+' : ''}{formatCurrency(parseFloat(proceed.pnl) / 1e9, 4, 'SOL')}</p>
							</div>
							{#if proceed.processingStatus === 'cooldown' && proceed.cooldownEndTime}
								<div>
									<p class="text-sm text-gray-500">Time Remaining</p>
									<p class="font-semibold text-warning-600">{formatTimeRemaining(proceed.cooldownEndTime)}</p>
								</div>
							{/if}
						</div>
					</div>
				{/each}
			</div>
		{/if}
	{/if}
</div>