<script>
	import { createEventDispatcher } from 'svelte';
	import { CheckCircle, XCircle, AlertCircle, Info, X } from 'lucide-svelte';

	export let type = 'info'; // success, error, warning, info
	export let message = '';
	export let duration = 5000;
	export let dismissible = true;

	const dispatch = createEventDispatcher();

	let visible = true;
	let timeoutId;

	$: {
		if (duration > 0) {
			clearTimeout(timeoutId);
			timeoutId = setTimeout(() => {
				dismiss();
			}, duration);
		}
	}

	function dismiss() {
		visible = false;
		setTimeout(() => {
			dispatch('dismiss');
		}, 300);
	}

	function getIcon(type) {
		switch (type) {
			case 'success': return CheckCircle;
			case 'error': return XCircle;
			case 'warning': return AlertCircle;
			default: return Info;
		}
	}

	function getClasses(type) {
		const base = 'flex items-center p-4 rounded-lg shadow-lg border transition-all duration-300 transform';
		const typeClasses = {
			success: 'bg-success-50 border-success-200 text-success-800',
			error: 'bg-error-50 border-error-200 text-error-800',
			warning: 'bg-warning-50 border-warning-200 text-warning-800',
			info: 'bg-primary-50 border-primary-200 text-primary-800'
		};
		const visibilityClass = visible ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0';
		return `${base} ${typeClasses[type]} ${visibilityClass}`;
	}
</script>

<div class={getClasses(type)}>
	<svelte:component this={getIcon(type)} class="w-5 h-5 mr-3 flex-shrink-0" />
	
	<p class="flex-1 text-sm font-medium">{message}</p>
	
	{#if dismissible}
		<button 
			on:click={dismiss}
			class="ml-3 flex-shrink-0 rounded-lg p-1 hover:bg-black hover:bg-opacity-10 transition-colors"
		>
			<X class="w-4 h-4" />
		</button>
	{/if}
</div>