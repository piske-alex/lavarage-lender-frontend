<script>
	import { onMount } from 'svelte';
	import { isConnected, address } from '../lib/stores/wallet.js';
	import { 
		showWelcomeModal, 
		showRiskDisclosure,
		initializeOnboarding,
		shouldShowRiskDisclosure,
		triggerRiskDisclosure
	} from '../lib/stores/onboarding.js';
	import {
		WelcomeModal,
		RiskDisclosureModal,
		HowItWorks
	} from '../lib/components/onboarding';
	import Tooltip from '../lib/components/ui/Tooltip.svelte';
	import { 
		TrendingUp, 
		Building2, 
		Wallet, 
		TrendingDown,
		Plus,
		HelpCircle,
		BookOpen,
		ArrowRight
	} from 'lucide-svelte';
	
	// Mock data - replace with real data from stores
	let dashboardData = {
		totalLiquidity: 0,
		activeOffers: 0,
		totalInterestEarned: 0,
		activePositions: 0,
		utilizationRate: 0,
		avgAPR: 0
	};
	
	onMount(() => {
		// Initialize onboarding for new users
		initializeOnboarding();
	});
	
	function handleCreateFirstOffer() {
		// Check if risk disclosure is needed
		if (shouldShowRiskDisclosure()) {
			triggerRiskDisclosure();
		} else {
			// Navigate to create offer page
			window.location.href = '/offers/create';
		}
	}
	
	function handleRiskAccepted() {
		// Navigate to create offer page after risk acceptance
		window.location.href = '/offers/create';
	}
	
	const quickActions = [
		{
			title: 'Create Your First Offer',
			description: 'Start earning by creating a loan offer',
			icon: Plus,
			action: handleCreateFirstOffer,
			primary: true
		},
		{
			title: 'How It Works',
			description: 'Learn the 3-step lending process',
			icon: HelpCircle,
			href: '/how-it-works'
		},
		{
			title: 'Read FAQ',
			description: 'Get answers to common questions',
			icon: BookOpen,
			href: '/faq'
		}
	];
	
	const stats = [
		{
			label: 'Total Liquidity',
			value: dashboardData.totalLiquidity,
			format: 'currency',
			icon: TrendingUp,
			tooltip: 'Total amount of funds you have available for lending'
		},
		{
			label: 'Active Offers',
			value: dashboardData.activeOffers,
			format: 'number',
			icon: Building2,
			tooltip: 'Number of loan offers currently accepting borrowers'
		},
		{
			label: 'Active Positions',
			value: dashboardData.activePositions,
			format: 'number',
			icon: Wallet,
			tooltip: 'Number of borrower positions using your liquidity'
		},
		{
			label: 'Interest Earned',
			value: dashboardData.totalInterestEarned,
			format: 'currency',
			icon: TrendingDown,
			tooltip: 'Total interest earned from all your lending activities'
		}
	];
	
	function formatValue(value, format) {
		if (format === 'currency') {
			return new Intl.NumberFormat('en-US', {
				style: 'currency',
				currency: 'USD',
				minimumFractionDigits: 0,
				maximumFractionDigits: 0
			}).format(value);
		}
		return value.toString();
	}
</script>

<svelte:head>
	<title>Dashboard - Lavarage Lender</title>
	<meta name="description" content="Earn competitive returns on your crypto through decentralized lending. Create loan offers, monitor positions, and track your earnings." />
</svelte:head>

<!-- Onboarding Modals -->
<WelcomeModal bind:isOpen={$showWelcomeModal} />
<RiskDisclosureModal 
	bind:isOpen={$showRiskDisclosure} 
	on:accept={handleRiskAccepted}
/>

<div class="space-y-8">
	{#if !$isConnected}
		<!-- Welcome Hero for Disconnected Users -->
		<div class="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-xl p-8 text-center">
			<h1 class="text-3xl font-bold text-gray-900 mb-4">
				Welcome to Lavarage Lending
			</h1>
			<p class="text-lg text-gray-600 mb-6 max-w-2xl mx-auto">
				Earn competitive returns on your crypto holdings by providing liquidity 
				to borrowers for leveraged trading positions.
			</p>
			<div class="flex flex-col sm:flex-row gap-4 justify-center">
				<button class="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors">
					Connect Wallet to Start
				</button>
				<a 
					href="/how-it-works" 
					class="px-6 py-3 border border-blue-600 text-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
				>
					Learn How It Works
				</a>
			</div>
		</div>
		
		<!-- How It Works Preview -->
		<HowItWorks variant="section" />
	{:else}
		<!-- Connected User Dashboard -->
		<div class="flex items-center justify-between">
			<div>
				<h1 class="text-2xl font-bold text-gray-900">Dashboard</h1>
				<p class="text-gray-600">Welcome back, {$address?.slice(0, 6)}...{$address?.slice(-4)}</p>
			</div>
			
			<div class="flex space-x-2">
				<Tooltip content="Get help and answers to common questions" variant="help">
					<a href="/faq" class="p-2 text-gray-400 hover:text-gray-600 transition-colors">
						<HelpCircle class="w-5 h-5" />
					</a>
				</Tooltip>
			</div>
		</div>
		
		<!-- Stats Grid -->
		<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
			{#each stats as stat}
				<div class="bg-white p-6 rounded-lg shadow-sm border">
					<div class="flex items-center justify-between mb-4">
						<div class="p-2 bg-gray-100 rounded-lg">
							<svelte:component this={stat.icon} class="w-5 h-5 text-gray-600" />
						</div>
						<Tooltip content={stat.tooltip} variant="help" size="sm" />
					</div>
					<div class="text-2xl font-bold text-gray-900 mb-1">
						{formatValue(stat.value, stat.format)}
					</div>
					<div class="text-sm text-gray-600">{stat.label}</div>
				</div>
			{/each}
		</div>
		
		<!-- Quick Actions -->
		<div class="bg-white rounded-lg shadow-sm border p-6">
			<h2 class="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
			<div class="grid grid-cols-1 md:grid-cols-3 gap-4">
				{#each quickActions as action}
					{#if action.href}
						<a 
							href={action.href}
							class="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors"
						>
							<div class="p-2 bg-blue-100 rounded-lg">
								<svelte:component this={action.icon} class="w-5 h-5 text-blue-600" />
							</div>
							<div class="flex-1">
								<h3 class="font-medium text-gray-900">{action.title}</h3>
								<p class="text-sm text-gray-600">{action.description}</p>
							</div>
							<ArrowRight class="w-4 h-4 text-gray-400" />
						</a>
					{:else}
						<button 
							on:click={action.action}
							class="flex items-center space-x-3 p-4 border rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors {
								action.primary ? 'border-blue-200 bg-blue-50' : 'border-gray-200'
							}"
						>
							<div class="p-2 bg-blue-100 rounded-lg">
								<svelte:component this={action.icon} class="w-5 h-5 text-blue-600" />
							</div>
							<div class="flex-1 text-left">
								<h3 class="font-medium text-gray-900">{action.title}</h3>
								<p class="text-sm text-gray-600">{action.description}</p>
							</div>
							<ArrowRight class="w-4 h-4 text-gray-400" />
						</button>
					{/if}
				{/each}
			</div>
		</div>
		
		<!-- Recent Activity Placeholder -->
		<div class="bg-white rounded-lg shadow-sm border p-6">
			<h2 class="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h2>
			<div class="text-center py-12">
				<div class="w-12 h-12 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center">
					<TrendingUp class="w-6 h-6 text-gray-400" />
				</div>
				<h3 class="text-lg font-medium text-gray-900 mb-2">No activity yet</h3>
				<p class="text-gray-600 mb-4">Create your first loan offer to start earning interest</p>
				<button 
					class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
					on:click={handleCreateFirstOffer}
				>
					Create Offer
				</button>
			</div>
		</div>
	{/if}
</div>