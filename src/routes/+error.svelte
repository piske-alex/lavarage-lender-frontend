<script>
	import { page } from '$app/stores';
	import { Home, RefreshCw } from 'lucide-svelte';

	function refresh() {
		location.reload();
	}
</script>

<svelte:head>
	<title>Error - Lavarage Lender</title>
</svelte:head>

<div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
	<div class="max-w-md w-full space-y-8 text-center">
		<div>
			<div class="w-20 h-20 bg-error-100 rounded-full flex items-center justify-center mx-auto mb-6">
				<span class="text-4xl font-bold text-error-600">{$page.status}</span>
			</div>
			
			<h1 class="text-3xl font-bold text-gray-900 mb-2">
				{#if $page.status === 404}
					Page Not Found
				{:else if $page.status === 500}
					Server Error
				{:else}
					Something went wrong
				{/if}
			</h1>
			
			<p class="text-gray-600 mb-8">
				{#if $page.status === 404}
					The page you're looking for doesn't exist or has been moved.
				{:else if $page.status === 500}
					We're experiencing technical difficulties. Please try again later.
				{:else}
					An unexpected error occurred. Please try refreshing the page.
				{/if}
			</p>
			
			{#if $page.error?.message}
				<div class="bg-error-50 border border-error-200 rounded-lg p-4 mb-6">
					<p class="text-sm text-error-700">{$page.error.message}</p>
				</div>
			{/if}
		</div>
		
		<div class="space-y-3">
			<a href="/" class="btn btn-primary w-full flex items-center justify-center space-x-2">
				<Home class="w-4 h-4" />
				<span>Go to Dashboard</span>
			</a>
			
			<button 
				on:click={refresh}
				class="btn btn-secondary w-full flex items-center justify-center space-x-2"
			>
				<RefreshCw class="w-4 h-4" />
				<span>Refresh Page</span>
			</button>
		</div>
	</div>
</div>