<script>
	import { fade, fly } from 'svelte/transition';
	import { 
		PlusCircle, 
		Users, 
		TrendingUp, 
		Shield, 
		ArrowRight,
		CheckCircle,
		DollarSign,
		BarChart3,
		AlertTriangle
	} from 'lucide-svelte';

	export let variant = 'section'; // 'page' | 'section'
	
	const steps = [
		{
			id: 1,
			title: "Create Loan Offers",
			description: "Set your lending terms including interest rate, collateral type, and maximum exposure",
			icon: PlusCircle,
			details: [
				"Choose supported collateral tokens (SOL, ETH, BTC, etc.)",
				"Set competitive interest rates (20-100% APR typical)",
				"Define maximum exposure limits for risk management",
				"Select quote token (SOL or USDC) for lending"
			],
			color: "blue"
		},
		{
			id: 2,
			title: "Borrowers Use Your Liquidity",
			description: "Traders borrow from your offers to open leveraged positions with overcollateralized safety",
			icon: Users,
			details: [
				"Borrowers provide collateral worth 120-400% of loan value",
				"Your liquidity enables leveraged trading strategies",
				"Positions are automatically monitored for health",
				"Liquidation system protects against losses"
			],
			color: "green"
		},
		{
			id: 3,
			title: "Earn Interest Automatically",
			description: "Watch your portfolio grow as interest accrues from active borrower positions",
			icon: TrendingUp,
			details: [
				"Interest compounds automatically over time",
				"Real-time tracking of earnings and utilization",
				"Positions monitored 24/7 for risk management",
				"Liquidation proceeds automatically processed"
			],
			color: "purple"
		}
	];

	const benefits = [
		{
			title: "Overcollateralized Safety",
			description: "All positions require 120-400% collateral coverage",
			icon: Shield,
			stat: "120-400%",
			statLabel: "Collateral Ratio"
		},
		{
			title: "Competitive Yields",
			description: "Earn higher returns than traditional DeFi protocols",
			icon: DollarSign,
			stat: "20-100%",
			statLabel: "Typical APR"
		},
		{
			title: "Real-time Monitoring",
			description: "Professional analytics and position tracking",
			icon: BarChart3,
			stat: "24/7",
			statLabel: "Monitoring"
		},
		{
			title: "Automatic Liquidation",
			description: "Instant liquidation system protects your capital",
			icon: CheckCircle,
			stat: "<5min",
			statLabel: "Liquidation Time"
		}
	];

	const riskFactors = [
		{
			title: "Smart Contract Risk",
			description: "Code vulnerabilities may exist despite audits",
			severity: "Medium"
		},
		{
			title: "Market Volatility",
			description: "Rapid price movements can affect collateral values",
			severity: "High"
		},
		{
			title: "Liquidation Delays",
			description: "Network congestion may delay liquidations",
			severity: "Low"
		},
		{
			title: "Liquidity Risk",
			description: "May be difficult to withdraw during market stress",
			severity: "Medium"
		}
	];
</script>

<div class="bg-white">
	{#if variant === 'page'}
		<!-- Full Page Header -->
		<div class="bg-gradient-to-br from-blue-50 to-indigo-100 py-16">
			<div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
				<h1 class="text-4xl font-bold text-gray-900 mb-4">
					How Lavarage Lending Works
				</h1>
				<p class="text-xl text-gray-600 max-w-2xl mx-auto">
					A simple 3-step process to transform your crypto holdings into a profitable lending business
				</p>
			</div>
		</div>
	{:else}
		<!-- Section Header -->
		<div class="text-center mb-12">
			<h2 class="text-3xl font-bold text-gray-900 mb-4">
				How It Works
			</h2>
			<p class="text-gray-600 max-w-2xl mx-auto">
				Simple process to start earning on your crypto holdings
			</p>
		</div>
	{/if}

	<!-- Main Steps -->
	<div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
		<div class="space-y-16">
			{#each steps as step, index}
				<div 
					class="relative"
					transition:fly={{ y: 50, duration: 500, delay: index * 100 }}
				>
					<!-- Step Content -->
					<div class="flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
						<!-- Step Number & Icon -->
						<div class="flex-shrink-0 relative">
							<div class="w-24 h-24 bg-{step.color}-100 rounded-full flex items-center justify-center relative">
								<svelte:component this={step.icon} class="w-10 h-10 text-{step.color}-600" />
								<div class="absolute -top-2 -right-2 w-8 h-8 bg-{step.color}-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
									{step.id}
								</div>
							</div>
							
							{#if index < steps.length - 1}
								<div class="hidden lg:block absolute top-24 left-1/2 transform -translate-x-1/2">
									<ArrowRight class="w-6 h-6 text-gray-300 transform rotate-90" />
								</div>
							{/if}
						</div>
						
						<!-- Step Info -->
						<div class="flex-1 text-center lg:text-left">
							<h3 class="text-2xl font-bold text-gray-900 mb-3">
								{step.title}
							</h3>
							<p class="text-gray-600 text-lg mb-6">
								{step.description}
							</p>
							
							<!-- Step Details -->
							<div class="grid sm:grid-cols-2 gap-3">
								{#each step.details as detail}
									<div class="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
										<CheckCircle class="w-5 h-5 text-{step.color}-500 mt-0.5 flex-shrink-0" />
										<span class="text-sm text-gray-700">{detail}</span>
									</div>
								{/each}
							</div>
						</div>
					</div>
					
					{#if index < steps.length - 1}
						<div class="block lg:hidden mt-8 flex justify-center">
							<ArrowRight class="w-6 h-6 text-gray-300 transform rotate-90" />
						</div>
					{/if}
				</div>
			{/each}
		</div>
	</div>

	<!-- Benefits Section -->
	<div class="bg-gray-50 py-16">
		<div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
			<div class="text-center mb-12">
				<h2 class="text-3xl font-bold text-gray-900 mb-4">
					Why Choose Lavarage?
				</h2>
				<p class="text-gray-600 max-w-2xl mx-auto">
					Professional-grade lending platform with institutional security and retail accessibility
				</p>
			</div>
			
			<div class="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
				{#each benefits as benefit, index}
					<div 
						class="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow"
						transition:fly={{ y: 30, duration: 400, delay: index * 100 }}
					>
						<div class="flex items-center justify-between mb-4">
							<div class="p-3 bg-blue-50 rounded-lg">
								<svelte:component this={benefit.icon} class="w-6 h-6 text-blue-600" />
							</div>
							<div class="text-right">
								<div class="text-2xl font-bold text-gray-900">{benefit.stat}</div>
								<div class="text-xs text-gray-500">{benefit.statLabel}</div>
							</div>
						</div>
						<h3 class="font-semibold text-gray-900 mb-2">{benefit.title}</h3>
						<p class="text-sm text-gray-600">{benefit.description}</p>
					</div>
				{/each}
			</div>
		</div>
	</div>

	<!-- Risk Disclosure Section -->
	<div class="py-16">
		<div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
			<div class="bg-amber-50 border border-amber-200 rounded-xl p-8">
				<div class="flex items-start space-x-4">
					<AlertTriangle class="w-8 h-8 text-amber-600 flex-shrink-0 mt-1" />
					<div class="flex-1">
						<h3 class="text-xl font-bold text-amber-900 mb-4">
							Important Risk Considerations
						</h3>
						<p class="text-amber-800 mb-6">
							While Lavarage implements multiple safety mechanisms, all DeFi lending involves risks. 
							Please review these factors before lending:
						</p>
						
						<div class="grid sm:grid-cols-2 gap-4">
							{#each riskFactors as risk}
								<div class="bg-white p-4 rounded-lg border border-amber-200">
									<div class="flex items-center justify-between mb-2">
										<h4 class="font-semibold text-gray-900">{risk.title}</h4>
										<span class="px-2 py-1 text-xs rounded-full {
											risk.severity === 'High' ? 'bg-red-100 text-red-700' :
											risk.severity === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
											'bg-green-100 text-green-700'
										}">
											{risk.severity}
										</span>
									</div>
									<p class="text-sm text-gray-600">{risk.description}</p>
								</div>
							{/each}
						</div>
						
						<div class="mt-6 pt-6 border-t border-amber-200">
							<p class="text-sm text-amber-800">
								<strong>Recommendation:</strong> Only lend funds you can afford to lose and start with small amounts 
								to familiarize yourself with the platform.
							</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>

	{#if variant === 'page'}
		<!-- Call to Action -->
		<div class="bg-blue-600 py-16">
			<div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
				<h2 class="text-3xl font-bold text-white mb-4">
					Ready to Start Lending?
				</h2>
				<p class="text-blue-100 text-lg mb-8 max-w-2xl mx-auto">
					Join thousands of lenders earning competitive returns on their crypto holdings
				</p>
				<div class="flex flex-col sm:flex-row gap-4 justify-center">
					<button class="px-8 py-3 bg-white text-blue-600 rounded-lg font-semibold hover:bg-gray-50 transition-colors">
						Connect Wallet
					</button>
					<button class="px-8 py-3 border border-blue-300 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors">
						View Documentation
					</button>
				</div>
			</div>
		</div>
	{/if}
</div>