<script>
	import HowItWorks from '../../lib/components/onboarding/HowItWorks.svelte';
	import { ArrowLeft } from 'lucide-svelte';
	import { goto } from '$app/navigation';
	
	function goBack() {
		goto('/');
	}
</script>

<svelte:head>
	<title>How It Works - Lavarage Lender Dashboard</title>
	<meta name="description" content="Learn how Lavarage lending works. A simple 3-step process to earn competitive returns on your crypto holdings through decentralized lending." />
</svelte:head>

<div class="min-h-screen bg-gray-50">
	<!-- Back Button -->
	<div class="bg-white shadow-sm border-b">
		<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
			<button 
				class="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors"
				on:click={goBack}
			>
				<ArrowLeft class="w-4 h-4" />
				<span>Back to Dashboard</span>
			</button>
		</div>
	</div>
	
	<!-- How It Works Content -->
	<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
		<HowItWorks variant="page" />
	</div>
</div>