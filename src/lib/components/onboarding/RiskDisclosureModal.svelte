<script>
	import { createEventDispatcher } from 'svelte';
	import { fade, fly } from 'svelte/transition';
	import { 
		AlertTriangle, 
		X, 
		CheckCircle, 
		ExternalLink,
		FileText,
		Shield,
		TrendingDown,
		Clock,
		Droplets
	} from 'lucide-svelte';
	
	export let isOpen = false;
	
	const dispatch = createEventDispatcher();
	
	let hasReadTerms = false;
	let hasReadRisks = false;
	let acceptsRisks = false;
	let canProceed = false;
	
	$: canProceed = hasReadTerms && hasReadRisks && acceptsRisks;
	
	const risks = [
		{
			title: "Smart Contract Risk",
			description: "Despite audits, smart contracts may contain vulnerabilities that could result in loss of funds.",
			icon: Shield,
			severity: "High",
			details: [
				"Code bugs or exploits could drain lending pools",
				"Protocol upgrades may introduce new vulnerabilities", 
				"Third-party integrations may have security flaws"
			]
		},
		{
			title: "Market Volatility Risk",
			description: "Rapid price movements can affect collateral values and liquidation outcomes.",
			icon: TrendingDown,
			severity: "High", 
			details: [
				"Extreme volatility may cause inadequate liquidations",
				"Flash crashes can result in losses even with overcollateralization",
				"Correlation risk when collateral and quote tokens move together"
			]
		},
		{
			title: "Liquidation Risk",
			description: "Network congestion or system failures may delay liquidations, causing losses.",
			icon: Clock,
			severity: "Medium",
			details: [
				"High gas fees may prevent timely liquidations",
				"Oracle failures could provide incorrect price data",
				"MEV attacks may front-run liquidation transactions"
			]
		},
		{
			title: "Liquidity Risk", 
			description: "During market stress, it may be difficult to withdraw your funds when needed.",
			icon: Droplets,
			severity: "Medium",
			details: [
				"High utilization may prevent immediate withdrawals",
				"Market panic could cause liquidity crunches",
				"Protocol pausing may temporarily lock funds"
			]
		}
	];
	
	function close() {
		dispatch('close');
		isOpen = false;
		resetForm();
	}
	
	function acceptAndProceed() {
		if (!canProceed) return;
		
		// Store user acceptance in localStorage
		localStorage.setItem('lavarage_risk_acknowledged', JSON.stringify({
			timestamp: Date.now(),
			version: '1.0'
		}));
		
		dispatch('accept');
		close();
	}
	
	function resetForm() {
		hasReadTerms = false;
		hasReadRisks = false;
		acceptsRisks = false;
	}
	
	function openExternalLink(url) {
		window.open(url, '_blank', 'noopener,noreferrer');
	}
</script>

{#if isOpen}
	<!-- Modal Backdrop -->
	<div 
		class="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4"
		transition:fade={{ duration: 200 }}
		role="dialog"
		aria-modal="true"
		aria-labelledby="risk-disclosure-title"
	>
		<!-- Modal Content -->
		<div 
			class="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
			transition:fly={{ y: 50, duration: 300 }}
			on:click|stopPropagation
		>
			<!-- Header -->
			<div class="bg-red-50 border-b border-red-200 px-6 py-4 relative">
				<div class="flex items-center space-x-3">
					<div class="p-2 bg-red-100 rounded-lg">
						<AlertTriangle class="w-6 h-6 text-red-600" />
					</div>
					<div>
						<h2 id="risk-disclosure-title" class="text-xl font-bold text-red-900">
							Risk Disclosure & Terms Agreement
						</h2>
						<p class="text-red-700 text-sm">
							Please read carefully before creating your first loan offer
						</p>
					</div>
				</div>
				
				<button
					class="absolute top-4 right-4 p-2 hover:bg-red-100 rounded-lg transition-colors"
					on:click={close}
					aria-label="Close risk disclosure"
				>
					<X class="w-5 h-5 text-red-600" />
				</button>
			</div>
			
			<!-- Scrollable Content -->
			<div class="overflow-y-auto max-h-[60vh] px-6 py-6">
				<!-- Important Notice -->
				<div class="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
					<div class="flex items-start space-x-3">
						<AlertTriangle class="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
						<div>
							<h3 class="font-semibold text-amber-900 mb-2">Important Notice</h3>
							<p class="text-amber-800 text-sm">
								DeFi lending involves significant risks. You may lose some or all of your funds. 
								Only lend what you can afford to lose and ensure you understand these risks.
							</p>
						</div>
					</div>
				</div>
				
				<!-- Risk Factors -->
				<div class="space-y-6">
					<h3 class="text-lg font-bold text-gray-900 mb-4">Key Risk Factors</h3>
					
					{#each risks as risk, index}
						<div 
							class="border border-gray-200 rounded-lg p-4"
							transition:fly={{ y: 20, duration: 300, delay: index * 100 }}
						>
							<div class="flex items-start space-x-4">
								<div class="p-2 bg-gray-100 rounded-lg flex-shrink-0">
									<svelte:component this={risk.icon} class="w-5 h-5 text-gray-600" />
								</div>
								
								<div class="flex-1">
									<div class="flex items-center justify-between mb-2">
										<h4 class="font-semibold text-gray-900">{risk.title}</h4>
										<span class="px-2 py-1 text-xs rounded-full {
											risk.severity === 'High' ? 'bg-red-100 text-red-700' :
											risk.severity === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
											'bg-green-100 text-green-700'
										}">
											{risk.severity} Risk
										</span>
									</div>
									
									<p class="text-gray-600 text-sm mb-3">{risk.description}</p>
									
									<ul class="space-y-1">
										{#each risk.details as detail}
											<li class="flex items-start space-x-2 text-sm text-gray-500">
												<span class="w-1 h-1 bg-gray-400 rounded-full mt-2 flex-shrink-0"></span>
												<span>{detail}</span>
											</li>
										{/each}
									</ul>
								</div>
							</div>
						</div>
					{/each}
				</div>
				
				<!-- Legal Disclaimer -->
				<div class="mt-8 p-4 bg-gray-50 rounded-lg border">
					<h4 class="font-semibold text-gray-900 mb-2">Legal Disclaimer</h4>
					<p class="text-sm text-gray-600 mb-3">
						Lavarage is not a registered investment advisor. This platform provides software tools only. 
						All lending decisions are your responsibility. Past performance does not guarantee future results.
					</p>
					<div class="flex items-center space-x-4">
						<button 
							class="flex items-center text-blue-600 hover:text-blue-800 transition-colors text-sm"
							on:click={() => openExternalLink('/terms-of-service')}
						>
							<FileText class="w-4 h-4 mr-1" />
							Terms of Service
							<ExternalLink class="w-3 h-3 ml-1" />
						</button>
						<button 
							class="flex items-center text-blue-600 hover:text-blue-800 transition-colors text-sm"
							on:click={() => openExternalLink('/privacy-policy')}
						>
							<FileText class="w-4 h-4 mr-1" />
							Privacy Policy
							<ExternalLink class="w-3 h-3 ml-1" />
						</button>
					</div>
				</div>
			</div>
			
			<!-- Footer with Checkboxes -->
			<div class="bg-gray-50 px-6 py-4 border-t">
				<div class="space-y-4">
					<!-- Terms Checkbox -->
					<label class="flex items-start space-x-3 cursor-pointer">
						<input
							type="checkbox"
							bind:checked={hasReadTerms}
							class="mt-1 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
						/>
						<span class="text-sm text-gray-700">
							I have read and agree to the 
							<button 
								class="text-blue-600 hover:underline"
								on:click={() => openExternalLink('/terms-of-service')}
							>
								Terms of Service
							</button> 
							and 
							<button 
								class="text-blue-600 hover:underline"
								on:click={() => openExternalLink('/privacy-policy')}
							>
								Privacy Policy
							</button>
						</span>
					</label>
					
					<!-- Risk Acknowledgment Checkbox -->
					<label class="flex items-start space-x-3 cursor-pointer">
						<input
							type="checkbox"
							bind:checked={hasReadRisks}
							class="mt-1 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
						/>
						<span class="text-sm text-gray-700">
							I have read and understand all risk factors outlined above
						</span>
					</label>
					
					<!-- Risk Acceptance Checkbox -->
					<label class="flex items-start space-x-3 cursor-pointer">
						<input
							type="checkbox"
							bind:checked={acceptsRisks}
							class="mt-1 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
						/>
						<span class="text-sm text-gray-700">
							I acknowledge that I may lose some or all of my funds and accept these risks
						</span>
					</label>
				</div>
				
				<!-- Action Buttons -->
				<div class="flex items-center justify-between mt-6">
					<button
						class="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
						on:click={close}
					>
						Cancel
					</button>
					
					<button
						class="px-6 py-3 bg-red-600 text-white rounded-lg font-medium transition-colors {
							canProceed ? 'hover:bg-red-700' : 'opacity-50 cursor-not-allowed'
						}"
						on:click={acceptAndProceed}
						disabled={!canProceed}
					>
						I Accept the Risks - Proceed
					</button>
				</div>
			</div>
		</div>
	</div>
{/if}