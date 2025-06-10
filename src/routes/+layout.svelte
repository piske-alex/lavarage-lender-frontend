<script>
	import '../app.css';
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { isConnected, address } from '../lib/stores/wallet.js';
	import { fetchLenderOffers, fetchLenderPositions, fetchLiquidationProceeds } from '../lib/stores/lender.js';
	import WalletConnect from '../lib/components/WalletConnect.svelte';
	import { Building2, TrendingUp, Wallet, Menu, X, TrendingDown, HelpCircle, BookOpen } from 'lucide-svelte';

	let mobileMenuOpen = false;

	// Auto-fetch data when wallet is connected
	$: if ($isConnected && $address) {
		fetchLenderOffers($address);
		fetchLenderPositions($address);
		fetchLiquidationProceeds($address);
	}

	const navigation = [
		{ name: 'Dashboard', href: '/', icon: TrendingUp },
		{ name: 'My Offers', href: '/offers', icon: Building2 },
		{ name: 'Positions', href: '/positions', icon: Wallet },
		{ name: 'Liquidations', href: '/liquidations', icon: TrendingDown }
	];

	const helpNavigation = [
		{ name: 'How It Works', href: '/how-it-works', icon: HelpCircle },
		{ name: 'FAQ', href: '/faq', icon: BookOpen }
	];

	function isActivePage(href) {
		if (href === '/') {
			return $page.url.pathname === '/';
		}
		return $page.url.pathname.startsWith(href);
	}
</script>

<div class="min-h-screen bg-gray-50">
	<!-- Navigation -->
	<nav class="bg-white shadow-sm border-b border-gray-200">
		<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
			<div class="flex justify-between items-center h-16">
				<!-- Logo -->
				<div class="flex items-center space-x-3">
					<div class="w-8 h-8 bg-gradient-to-r from-primary-500 to-primary-600 rounded-lg flex items-center justify-center">
						<span class="text-white font-bold text-lg">L</span>
					</div>
					<div>
						<h1 class="text-xl font-bold text-gray-900">Lavarage</h1>
						<p class="text-xs text-gray-500">Lender Dashboard</p>
					</div>
				</div>

				<!-- Desktop Navigation -->
				<div class="hidden md:flex items-center space-x-8">
					<!-- Main Navigation -->
					<div class="flex space-x-6">
						{#each navigation as item}
							<a 
								href={item.href}
								class="flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors
									{isActivePage(item.href) 
										? 'bg-primary-100 text-primary-700' 
										: 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
									}"
							>
								<svelte:component this={item.icon} class="w-4 h-4" />
								<span>{item.name}</span>
							</a>
						{/each}
					</div>

					<!-- Divider -->
					<div class="h-6 w-px bg-gray-300"></div>

					<!-- Help Navigation -->
					<div class="flex space-x-4">
						{#each helpNavigation as item}
							<a 
								href={item.href}
								class="flex items-center space-x-1 px-2 py-1 rounded text-sm font-medium transition-colors
									{isActivePage(item.href) 
										? 'bg-blue-100 text-blue-700' 
										: 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
									}"
								title={item.name}
							>
								<svelte:component this={item.icon} class="w-4 h-4" />
								<span class="hidden lg:block">{item.name}</span>
							</a>
						{/each}
					</div>
				</div>

				<!-- Wallet Connection -->
				<div class="flex items-center space-x-4">
					<WalletConnect />
					
					<!-- Mobile menu button -->
					<button 
						class="md:hidden btn btn-secondary p-2"
						on:click={() => mobileMenuOpen = !mobileMenuOpen}
					>
						{#if mobileMenuOpen}
							<X class="w-5 h-5" />
						{:else}
							<Menu class="w-5 h-5" />
						{/if}
					</button>
				</div>
			</div>
		</div>

		<!-- Mobile Navigation -->
		{#if mobileMenuOpen}
			<div class="md:hidden border-t border-gray-200 bg-white">
				<div class="px-4 py-3 space-y-1">
					<!-- Main Navigation -->
					{#each navigation as item}
						<a 
							href={item.href}
							class="flex items-center space-x-3 px-3 py-2 rounded-lg text-base font-medium transition-colors
								{isActivePage(item.href) 
									? 'bg-primary-100 text-primary-700' 
									: 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
								}"
							on:click={() => mobileMenuOpen = false}
						>
							<svelte:component this={item.icon} class="w-5 h-5" />
							<span>{item.name}</span>
						</a>
					{/each}

					<!-- Help Section -->
					<div class="border-t border-gray-200 pt-4 mt-4">
						<div class="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
							Help & Support
						</div>
						{#each helpNavigation as item}
							<a 
								href={item.href}
								class="flex items-center space-x-3 px-3 py-2 rounded-lg text-base font-medium transition-colors
									{isActivePage(item.href) 
										? 'bg-blue-100 text-blue-700' 
										: 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
									}"
								on:click={() => mobileMenuOpen = false}
							>
								<svelte:component this={item.icon} class="w-5 h-5" />
								<span>{item.name}</span>
							</a>
						{/each}
					</div>
				</div>
			</div>
		{/if}
	</nav>

	<!-- Main Content -->
	<main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
		<slot />
	</main>
</div>
