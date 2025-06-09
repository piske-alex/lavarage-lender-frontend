<script>
	export let size = 'md'; // sm, md, lg
	export let color = 'primary'; // primary, white, gray

	const sizeClasses = {
		sm: 'w-4 h-4',
		md: 'w-6 h-6',
		lg: 'w-8 h-8'
	};

	const colorClasses = {
		primary: 'text-primary-600',
		white: 'text-white',
		gray: 'text-gray-400'
	};
</script>

<div class="flex items-center justify-center">
	<div class="{sizeClasses[size]} {colorClasses[color]} animate-spin">
		<svg class="w-full h-full" viewBox="0 0 24 24" fill="none">
			<circle 
				cx="12" 
				cy="12" 
				r="10" 
				stroke="currentColor" 
				stroke-width="2" 
				stroke-linecap="round" 
				stroke-dasharray="32" 
				stroke-dashoffset="32"
				fill="none"
			>
				<animate 
					attributeName="stroke-dasharray" 
					dur="2s" 
					values="0 32;16 16;0 32;16 16;0 32" 
					repeatCount="indefinite"
				/>
				<animate 
					attributeName="stroke-dashoffset" 
					dur="2s" 
					values="0;-16;-32;-48;-64" 
					repeatCount="indefinite"
				/>
			</circle>
		</svg>
	</div>
</div>