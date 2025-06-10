<script>
	import { createEventDispatcher } from 'svelte';
	import { fade, fly } from 'svelte/transition';
	import { HelpCircle, Info, AlertCircle } from 'lucide-svelte';
	
	export let content = '';
	export let position = 'top'; // 'top' | 'bottom' | 'left' | 'right'
	export let variant = 'info'; // 'info' | 'help' | 'warning'
	export let size = 'md'; // 'sm' | 'md' | 'lg'
	export let trigger = 'hover'; // 'hover' | 'click'
	export let disabled = false;
	export let maxWidth = '200px';
	
	const dispatch = createEventDispatcher();
	
	let isVisible = false;
	let tooltipElement;
	let triggerElement;
	let timeout;
	
	const icons = {
		info: Info,
		help: HelpCircle,
		warning: AlertCircle
	};
	
	const iconSizes = {
		sm: 'w-3 h-3',
		md: 'w-4 h-4',
		lg: 'w-5 h-5'
	};
	
	const iconColors = {
		info: 'text-blue-500 hover:text-blue-600',
		help: 'text-gray-400 hover:text-gray-600',
		warning: 'text-amber-500 hover:text-amber-600'
	};
	
	const tooltipColors = {
		info: 'bg-blue-600 text-white',
		help: 'bg-gray-900 text-white',
		warning: 'bg-amber-600 text-white'
	};
	
	function showTooltip() {
		if (disabled) return;
		
		clearTimeout(timeout);
		timeout = setTimeout(() => {
			isVisible = true;
			dispatch('show');
		}, trigger === 'hover' ? 300 : 0);
	}
	
	function hideTooltip() {
		if (disabled) return;
		
		clearTimeout(timeout);
		timeout = setTimeout(() => {
			isVisible = false;
			dispatch('hide');
		}, trigger === 'hover' ? 200 : 0);
	}
	
	function toggleTooltip() {
		if (disabled) return;
		
		if (trigger === 'click') {
			isVisible = !isVisible;
			dispatch(isVisible ? 'show' : 'hide');
		}
	}
	
	function handleKeydown(event) {
		if (event.key === 'Escape' && isVisible) {
			hisVisible = false;
			dispatch('hide');
		}
	}
	
	function getPositionClasses() {
		switch (position) {
			case 'top':
				return 'bottom-full left-1/2 transform -translate-x-1/2 mb-2';
			case 'bottom':
				return 'top-full left-1/2 transform -translate-x-1/2 mt-2';
			case 'left':
				return 'right-full top-1/2 transform -translate-y-1/2 mr-2';
			case 'right':
				return 'left-full top-1/2 transform -translate-y-1/2 ml-2';
			default:
				return 'bottom-full left-1/2 transform -translate-x-1/2 mb-2';
		}
	}
	
	function getArrowClasses() {
		switch (position) {
			case 'top':
				return 'top-full left-1/2 transform -translate-x-1/2 border-l-transparent border-r-transparent border-b-transparent';
			case 'bottom':
				return 'bottom-full left-1/2 transform -translate-x-1/2 border-l-transparent border-r-transparent border-t-transparent';
			case 'left':
				return 'left-full top-1/2 transform -translate-y-1/2 border-t-transparent border-b-transparent border-r-transparent';
			case 'right':
				return 'right-full top-1/2 transform -translate-y-1/2 border-t-transparent border-b-transparent border-l-transparent';
			default:
				return 'top-full left-1/2 transform -translate-x-1/2 border-l-transparent border-r-transparent border-b-transparent';
		}
	}
	
	function getArrowBorderColor() {
		switch (variant) {
			case 'info':
				return position === 'top' ? 'border-t-blue-600' : 
					   position === 'bottom' ? 'border-b-blue-600' :
					   position === 'left' ? 'border-l-blue-600' : 'border-r-blue-600';
			case 'warning':
				return position === 'top' ? 'border-t-amber-600' : 
					   position === 'bottom' ? 'border-b-amber-600' :
					   position === 'left' ? 'border-l-amber-600' : 'border-r-amber-600';
			default:
				return position === 'top' ? 'border-t-gray-900' : 
					   position === 'bottom' ? 'border-b-gray-900' :
					   position === 'left' ? 'border-l-gray-900' : 'border-r-gray-900';
		}
	}
</script>

<svelte:window on:keydown={handleKeydown} />

<div class="relative inline-block">
	<!-- Trigger -->
	<button
		bind:this={triggerElement}
		class="inline-flex items-center justify-center transition-colors cursor-help {
			disabled ? 'opacity-50 cursor-not-allowed' : iconColors[variant]
		}"
		on:mouseenter={trigger === 'hover' ? showTooltip : null}
		on:mouseleave={trigger === 'hover' ? hideTooltip : null}
		on:click={trigger === 'click' ? toggleTooltip : null}
		on:focus={showTooltip}
		on:blur={hideTooltip}
		aria-label={content}
		aria-describedby={isVisible ? 'tooltip-content' : null}
		{disabled}
	>
		<svelte:component 
			this={icons[variant]} 
			class={iconSizes[size]} 
		/>
	</button>
	
	<!-- Tooltip Content -->
	{#if isVisible && content}
		<div 
			bind:this={tooltipElement}
			id="tooltip-content"
			class="absolute z-50 px-3 py-2 text-sm rounded-lg shadow-lg pointer-events-none {tooltipColors[variant]} {getPositionClasses()}"
			style="max-width: {maxWidth};"
			transition:fade={{ duration: 150 }}
			role="tooltip"
		>
			<!-- Arrow -->
			<div 
				class="absolute w-0 h-0 border-4 {getArrowClasses()} {getArrowBorderColor()}"
			></div>
			
			<!-- Content -->
			<div class="relative z-10">
				{@html content}
			</div>
		</div>
	{/if}
</div>