<script>
	import FAQ from '../../lib/components/onboarding/FAQ.svelte';
	import { HelpCircle, ArrowLeft } from 'lucide-svelte';
	import { goto } from '$app/navigation';
	
	function goBack() {
		goto('/');
	}
</script>

<svelte:head>
	<title>FAQ - Lavarage Lender Dashboard</title>
	<meta name="description" content="Find answers to frequently asked questions about Lavarage lending, risks, returns, and how to get started." />
</svelte:head>

<div class="min-h-screen bg-gray-50">
	<!-- Header -->
	<div class="bg-white shadow-sm border-b">
		<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
			<div class="flex items-center space-x-4">
				<button 
					class="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
					on:click={goBack}
					aria-label="Go back"
				>
					<ArrowLeft class="w-5 h-5" />
				</button>
				
				<div class="flex items-center space-x-3">
					<div class="p-2 bg-blue-50 rounded-lg">
						<HelpCircle class="w-6 h-6 text-blue-600" />
					</div>
					<div>
						<h1 class="text-2xl font-bold text-gray-900">Help & FAQ</h1>
						<p class="text-gray-600">Everything you need to know about Lavarage lending</p>
					</div>
				</div>
			</div>
		</div>
	</div>
	
	<!-- FAQ Content -->
	<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
		<FAQ variant="full" />
	</div>
</div>