<script>
	import { onMount } from 'svelte';
	import { getConnectors } from '@wagmi/core';
	import { isConnected, address, isConnecting, connectWallet, disconnectWallet } from '../stores/wallet.js';
	import { formatAddress } from '../utils/format.js';
	import { Wallet, LogOut, Loader2 } from 'lucide-svelte';

	let connectors = [];
	let showConnectors = false;

	onMount(() => {
		connectors = getConnectors();
	});

	async function handleConnect(connector) {
		try {
			await connectWallet(connector);
			showConnectors = false;
		} catch (error) {
			console.error('Connection failed:', error);
		}
	}

	async function handleDisconnect() {
		try {
			await disconnectWallet();
		} catch (error) {
			console.error('Disconnection failed:', error);
		}
	}
</script>

<div class="relative">
	{#if $isConnected}
		<div class="flex items-center space-x-3">
			<div class="flex items-center space-x-2 bg-primary-50 text-primary-700 px-3 py-2 rounded-lg">
				<Wallet class="w-4 h-4" />
				<span class="font-medium">{formatAddress($address)}</span>
			</div>
			<button
				on:click={handleDisconnect}
				class="btn btn-secondary flex items-center space-x-2"
				title="Disconnect Wallet"
			>
				<LogOut class="w-4 h-4" />
				<span class="hidden sm:inline">Disconnect</span>
			</button>
		</div>
	{:else}
		<div class="relative">
			<button
				on:click={() => showConnectors = !showConnectors}
				class="btn btn-primary flex items-center space-x-2"
				disabled={$isConnecting}
			>
				{#if $isConnecting}
					<Loader2 class="w-4 h-4 animate-spin" />
					<span>Connecting...</span>
				{:else}
					<Wallet class="w-4 h-4" />
					<span>Connect Wallet</span>
				{/if}
			</button>

			{#if showConnectors}
				<div class="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-lg border border-gray-200 z-50">
					<div class="p-4">
						<h3 class="text-lg font-semibold text-gray-900 mb-3">Connect Wallet</h3>
						<div class="space-y-2">
							{#each connectors as connector}
								<button
									on:click={() => handleConnect(connector)}
									class="w-full flex items-center space-x-3 p-3 rounded-lg border border-gray-200 hover:border-primary-300 hover:bg-primary-50 transition-colors"
									disabled={$isConnecting}
								>
									<div class="w-8 h-8 bg-gradient-to-r from-primary-500 to-primary-600 rounded-lg flex items-center justify-center">
										<Wallet class="w-4 h-4 text-white" />
									</div>
									<span class="font-medium text-gray-900">{connector.name}</span>
								</button>
							{/each}
						</div>
					</div>
				</div>
			{/if}
		</div>
	{/if}
</div>

<!-- Close dropdown when clicking outside -->
{#if showConnectors}
	<div 
		class="fixed inset-0 z-40" 
		on:click={() => showConnectors = false}
		role="button"
		tabindex="-1"
		on:keydown={(e) => e.key === 'Escape' && (showConnectors = false)}
	></div>
{/if}