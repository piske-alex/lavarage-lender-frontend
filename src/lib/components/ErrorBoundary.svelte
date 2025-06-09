<script>
	export let error = null;
	export let errorId = Math.random().toString(36).slice(2);

	function retry() {
		error = null;
		location.reload();
	}
</script>

{#if error}
	<div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
		<div class="max-w-md w-full space-y-8">
			<div class="text-center">
				<div class="w-16 h-16 bg-error-100 rounded-full flex items-center justify-center mx-auto mb-4">
					<svg class="w-8 h-8 text-error-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
					</svg>
				</div>
				<h2 class="mt-6 text-3xl font-extrabold text-gray-900">Something went wrong</h2>
				<p class="mt-2 text-sm text-gray-600">
					We're sorry, but something unexpected happened. Please try refreshing the page.
				</p>
				
				{#if error.message}
					<div class="mt-4 p-4 bg-error-50 rounded-lg">
						<p class="text-sm text-error-700">Error: {error.message}</p>
					</div>
				{/if}
				
				<div class="mt-8 space-y-4">
					<button
						on:click={retry}
						class="w-full btn btn-primary"
					>
						Retry
					</button>
					
					<a href="/" class="w-full btn btn-secondary">
						Go to Dashboard
					</a>
				</div>
				
				<p class="mt-4 text-xs text-gray-500">
					Error ID: {errorId}
				</p>
			</div>
		</div>
	</div>
{:else}
	<slot />
{/if}