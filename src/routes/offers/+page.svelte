<script>
	import { onMount } from 'svelte';
	import { isConnected, address } from '../../lib/stores/wallet.js';
	import { offers, loading, fetchLenderOffers } from '../../lib/stores/lender.js';
	import { formatCurrency, formatPercentage, formatAddress, formatDateTime, getStatusColor, calculateUtilizationRate } from '../../lib/utils/format.js';
	import LoadingSpinner from '../../lib/components/LoadingSpinner.svelte';
	import { Plus, Settings, TrendingUp, Activity } from 'lucide-svelte';

	let filterStatus = 'all'; // all, active, inactive
	let sortBy = 'created'; // created, apr, utilization
	
	// Auto-refresh data
	onMount(() => {
		const interval = setInterval(() => {
			if ($isConnected && $address) {
				fetchLenderOffers($address);
			}
		}, 30000); // Refresh every 30 seconds
		
		return () => clearInterval(interval);
	});

	// Filter and sort offers
	$: filteredOffers = $offers
		.filter(offer => {
			if (filterStatus === 'active') return offer.active;
			if (filterStatus === 'inactive') return !offer.active;
			return true;
		})
		.sort((a, b) => {
			switch (sortBy) {
				case 'apr':
					return (b.apr || 0) - (a.apr || 0);
				case 'utilization':
					const aUtil = calculateUtilizationRate(a.currentExposure, a.maxExposure);
					const bUtil = calculateUtilizationRate(b.currentExposure, b.maxExposure);
					return bUtil - aUtil;
				case 'created':
				default:
					return new Date(b.createdAt) - new Date(a.createdAt);
			}
		});
</script>

<svelte:head>
	<title>My Offers - Lavarage Lender</title>
</svelte:head>

<div class="space-y-6">
	<!-- Header -->
	<div class="flex flex-col sm:flex-row sm:items-center sm:justify-between">
		<div>
			<h1 class="text-3xl font-bold text-gray-900">My Loan Offers</h1>
			<p class="mt-2 text-gray-600">Create and manage your lending offers</p>
		</div>
		
		{#if $isConnected}
			<div class="mt-4 sm:mt-0">
				<a href="/offers/create" class="btn btn-primary flex items-center space-x-2">
					<Plus class="w-4 h-4" />
					<span>Create New Offer</span>
				</a>
			</div>
		{/if}
	</div>

	{#if !$isConnected}
		<!-- Connect Wallet Prompt -->
		<div class="card text-center py-12">
			<div class="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
				<TrendingUp class="w-8 h-8 text-primary-600" />
			</div>
			<h2 class="text-xl font-semibold text-gray-900 mb-2">Connect Your Wallet</h2>
			<p class="text-gray-600">Connect your wallet to view and manage your loan offers</p>
		</div>
	{:else}
		<!-- Filters and Controls -->
		<div class="card">
			<div class="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
				<div class="flex space-x-4">
					<div>
						<label class="block text-sm font-medium text-gray-700 mb-1">Status</label>
						<select bind:value={filterStatus} class="input text-sm">
							<option value="all">All Offers</option>
							<option value="active">Active</option>
							<option value="inactive">Inactive</option>
						</select>
					</div>
					<div>
						<label class="block text-sm font-medium text-gray-700 mb-1">Sort By</label>
						<select bind:value={sortBy} class="input text-sm">
							<option value="created">Date Created</option>
							<option value="apr">APR (High to Low)</option>
							<option value="utilization">Utilization</option>
						</select>
					</div>
				</div>
				
				<div class="text-sm text-gray-600">
					{filteredOffers.length} of {$offers.length} offers
				</div>
			</div>
		</div>

		<!-- Offers List -->
		{#if $loading.offers}
			<div class="flex justify-center py-12">
				<LoadingSpinner size="lg" />
			</div>
		{:else if filteredOffers.length === 0}
			<div class="card text-center py-12">
				<div class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
					<Activity class="w-8 h-8 text-gray-400" />
				</div>
				<h3 class="text-lg font-medium text-gray-900 mb-2">
					{$offers.length === 0 ? 'No offers created yet' : 'No offers match your filters'}
				</h3>
				<p class="text-gray-600 mb-6">
					{$offers.length === 0 
						? 'Create your first loan offer to start earning yield' 
						: 'Try adjusting your filters to see more offers'
					}
				</p>
				{#if $offers.length === 0}
					<a href="/offers/create" class="btn btn-primary">
						Create First Offer
					</a>
				{/if}
			</div>
		{:else}
			<div class="space-y-4">
				{#each filteredOffers as offer}
					<div class="card hover:shadow-lg transition-shadow">
						<div class="flex flex-col lg:flex-row lg:items-center lg:justify-between">
							<div class="flex-1">
								<div class="flex items-center space-x-3 mb-3">
									<div class="w-10 h-10 bg-gradient-to-r from-primary-500 to-primary-600 rounded-lg flex items-center justify-center">
										<span class="text-white font-bold text-sm">
											{offer.collateralToken?.symbol?.slice(0, 2) || 'UN'}
										</span>
									</div>
									<div>
										<h3 class="font-semibold text-gray-900">
											{offer.collateralToken?.name || 'Unknown Token'}
										</h3>
										<p class="text-sm text-gray-500">
											{formatAddress(offer.publicKey)}
										</p>
									</div>
									<span class="badge {offer.active ? 'badge-success' : 'badge-error'}">
										{offer.active ? 'Active' : 'Inactive'}
									</span>
								</div>
								
								<div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
									<div>
										<p class="text-sm text-gray-500">APR</p>
										<p class="font-semibold text-lg">{formatPercentage(offer.apr)}</p>
									</div>
									<div>
										<p class="text-sm text-gray-500">Max Exposure</p>
										<p class="font-semibold">{formatCurrency(parseFloat(offer.maxExposure) / 1e9, 2, 'SOL')}</p>
									</div>
									<div>
										<p class="text-sm text-gray-500">Utilization</p>
										<p class="font-semibold">
											{formatPercentage(calculateUtilizationRate(offer.currentExposure, offer.maxExposure))}
										</p>
									</div>
									<div>
										<p class="text-sm text-gray-500">Created</p>
										<p class="font-semibold">{formatDateTime(offer.createdAt)}</p>
									</div>
								</div>
							</div>
							
							<div class="mt-4 lg:mt-0 lg:ml-6 flex space-x-2">
								<a 
									href="/offers/{offer.publicKey}" 
									class="btn btn-secondary flex items-center space-x-2"
								>
									<Settings class="w-4 h-4" />
									<span>Manage</span>
								</a>
							</div>
						</div>
					</div>
				{/each}
			</div>
		{/if}
	{/if}
</div>