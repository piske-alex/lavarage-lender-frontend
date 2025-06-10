<script>
	import { createEventDispatcher } from 'svelte';
	import { fade, fly } from 'svelte/transition';
	import { 
		ChevronRight, 
		ChevronLeft, 
		Shield, 
		TrendingUp, 
		BarChart3, 
		Zap, 
		BookOpen, 
		AlertTriangle,
		X,
		Play,
		Users
	} from 'lucide-svelte';
	
	export let isOpen = false;
	
	const dispatch = createEventDispatcher();
	
	let currentStep = 0;
	
	const steps = [
		{
			id: 'welcome',
			title: "Welcome to Lavarage Lending",
			subtitle: "Earn competitive returns on your crypto holdings",
			icon: TrendingUp,
			content: [
				"Transform your idle crypto assets into a profitable lending business",
				"Provide liquidity to borrowers for leveraged trading positions", 
				"Earn interest on your holdings while maintaining control",
				"Join thousands of lenders earning passive income in DeFi"
			],
			cta: "Let's Get Started"
		},
		{
			id: 'how-it-works',
			title: "How Lending Works",
			subtitle: "Simple 3-step process to start earning",
			icon: Zap,
			content: [
				"1. Create loan offers by setting your terms (interest rate, collateral type)",
				"2. Borrowers use your liquidity for leveraged positions",
				"3. Earn interest automatically while monitoring position health",
				"Your funds are secured by overcollateralized positions"
			],
			cta: "Understand the Process"
		},
		{
			id: 'benefits',
			title: "Key Benefits",
			subtitle: "Why choose Lavarage for lending",
			icon: Shield,
			content: [
				"🛡️ Overcollateralized positions protect your capital",
				"📈 Competitive interest rates (typically 20-100% APR)",
				"⚡ Real-time monitoring of all borrower positions",
				"🔄 Automatic liquidation system protects against losses"
			],
			cta: "Explore Benefits"
		},
		{
			id: 'risks',
			title: "Important Risks",
			subtitle: "Understanding the risks involved",
			icon: AlertTriangle,
			content: [
				"⚠️ Smart contract risks - code vulnerabilities may exist",
				"📉 Market volatility can affect collateral values",
				"🏃 Liquidation delays may result in partial losses",
				"💧 Liquidity risks during high market stress"
			],
			cta: "Review Risks",
			warning: true
		},
		{
			id: 'analytics',
			title: "Portfolio Analytics",
			subtitle: "Professional-grade monitoring tools",
			icon: BarChart3,
			content: [
				"📊 Real-time dashboard with key performance metrics",
				"🎯 Position monitoring with health indicators", 
				"💰 Liquidation proceeds tracking and management",
				"📈 Historical performance and yield analytics"
			],
			cta: "See Analytics"
		}
	];
	
	const currentStepData = steps[currentStep];
	
	function nextStep() {
		if (currentStep < steps.length - 1) {
			currentStep++;
		} else {
			completeOnboarding();
		}
	}
	
	function prevStep() {
		if (currentStep > 0) {
			currentStep--;
		}
	}
	
	function goToStep(step) {
		currentStep = step;
	}
	
	function completeOnboarding() {
		// Mark onboarding as completed
		localStorage.setItem('lavarage_onboarding_completed', 'true');
		dispatch('complete');
		close();
	}
	
	function close() {
		dispatch('close');
		isOpen = false;
	}
	
	function skipOnboarding() {
		localStorage.setItem('lavarage_onboarding_skipped', 'true');
		dispatch('skip');
		close();
	}
	
	function handleBackdropClick() {
		close();
	}
	
	function handleBackdropKeydown(event) {
		if (event.key === 'Escape') {
			close();
		}
	}
</script>

{#if isOpen}
	<!-- Modal Backdrop -->
	<button
		class="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 cursor-default"
		transition:fade={{ duration: 200 }}
		on:click={handleBackdropClick}
		on:keydown={handleBackdropKeydown}
		role="dialog"
		aria-modal="true"
		aria-labelledby="welcome-title"
	>
		<!-- Modal Content -->
		<div 
			class="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden relative"
			transition:fly={{ y: 50, duration: 300 }}
			on:click|stopPropagation
			role="document"
		>
			<!-- Close Button -->
			<button
				class="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-lg transition-colors z-10"
				on:click={close}
				aria-label="Close welcome modal"
			>
				<X class="w-5 h-5 text-gray-500" />
			</button>
			
			<!-- Progress Bar -->
			<div class="bg-gray-100 h-1">
				<div 
					class="bg-blue-600 h-full transition-all duration-300 ease-out"
					style="width: {((currentStep + 1) / steps.length) * 100}%"
				></div>
			</div>
			
			<!-- Modal Body -->
			<div class="p-8 pb-6">
				<!-- Step Content -->
				<div class="text-center mb-8">
					<div class="flex justify-center mb-4">
						<div class="p-4 bg-blue-50 rounded-full {currentStepData.warning ? 'bg-red-50' : ''}">
							<svelte:component 
								this={currentStepData.icon} 
								class="w-8 h-8 {currentStepData.warning ? 'text-red-600' : 'text-blue-600'}" 
							/>
						</div>
					</div>
					
					<h2 
						id="welcome-title"
						class="text-2xl font-bold text-gray-900 mb-2"
					>
						{currentStepData.title}
					</h2>
					
					<p class="text-gray-600 mb-6">
						{currentStepData.subtitle}
					</p>
					
					<!-- Content List -->
					<div class="text-left space-y-3 mb-8">
						{#each currentStepData.content as item, index}
							<div 
								class="flex items-start space-x-3 p-3 rounded-lg {currentStepData.warning ? 'bg-red-50 border border-red-100' : 'bg-gray-50'}"
								transition:fly={{ x: -20, duration: 200, delay: index * 100 }}
							>
								{#if currentStepData.warning}
									<AlertTriangle class="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
								{:else}
									<div class="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
								{/if}
								<p class="text-gray-700 text-sm leading-relaxed">
									{item}
								</p>
							</div>
						{/each}
					</div>
				</div>
				
				<!-- Step Indicators -->
				<div class="flex justify-center space-x-2 mb-6">
					{#each steps as step, index}
						<button
							class="w-3 h-3 rounded-full transition-all duration-200 {
								index === currentStep ? 'bg-blue-600' : 
								index < currentStep ? 'bg-blue-300' : 'bg-gray-200'
							}"
							on:click={() => goToStep(index)}
							aria-label="Go to step {index + 1}"
						></button>
					{/each}
				</div>
				
				<!-- Action Buttons -->
				<div class="flex items-center justify-between">
					<div class="flex space-x-3">
						{#if currentStep > 0}
							<button
								class="flex items-center px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
								on:click={prevStep}
							>
								<ChevronLeft class="w-4 h-4 mr-1" />
								Previous
							</button>
						{/if}
						
						<button
							class="text-gray-500 hover:text-gray-700 transition-colors text-sm"
							on:click={skipOnboarding}
						>
							Skip tutorial
						</button>
					</div>
					
					<button
						class="flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium {currentStepData.warning ? 'bg-red-600 hover:bg-red-700' : ''}"
						on:click={nextStep}
					>
						{currentStep === steps.length - 1 ? 'Start Lending' : currentStepData.cta}
						<ChevronRight class="w-4 h-4 ml-2" />
					</button>
				</div>
			</div>
			
			<!-- Footer -->
			<div class="bg-gray-50 px-8 py-4 border-t">
				<div class="flex items-center justify-between text-sm">
					<div class="flex items-center space-x-4 text-gray-500">
						<button class="flex items-center hover:text-blue-600 transition-colors">
							<BookOpen class="w-4 h-4 mr-1" />
							Documentation
						</button>
						<button class="flex items-center hover:text-blue-600 transition-colors">
							<Play class="w-4 h-4 mr-1" />
							Video Tutorial
						</button>
						<button class="flex items-center hover:text-blue-600 transition-colors">
							<Users class="w-4 h-4 mr-1" />
							Community
						</button>
					</div>
					
					<div class="text-gray-400">
						Step {currentStep + 1} of {steps.length}
					</div>
				</div>
			</div>
		</div>
	</button>
{/if}