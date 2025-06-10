<script>
	import { slide } from 'svelte/transition';
	import { ChevronDown, Search, HelpCircle } from 'lucide-svelte';
	
	export let variant = 'full'; // 'full' | 'compact'
	export let searchable = true;
	export let categories = true;
	
	let searchQuery = '';
	let selectedCategory = 'all';
	let openItems = new Set();
	
	const faqData = [
		{
			id: 1,
			category: 'getting-started',
			categoryLabel: 'Getting Started',
			question: "What is Lavarage and how does it work?",
			answer: "Lavarage is a decentralized lending platform that allows you to earn interest by providing liquidity to borrowers for leveraged trading. You create loan offers with your terms, borrowers use your funds for overcollateralized positions, and you earn interest automatically."
		},
		{
			id: 2,
			category: 'getting-started',
			categoryLabel: 'Getting Started',
			question: "How do I start lending on Lavarage?",
			answer: "First, connect your Web3 wallet (MetaMask, WalletConnect, etc.). Then create your first loan offer by choosing a collateral token, setting an interest rate, and defining your maximum exposure. Once live, borrowers can use your liquidity for leveraged positions."
		},
		{
			id: 3,
			category: 'getting-started',
			categoryLabel: 'Getting Started',
			question: "What tokens can I lend?",
			answer: "You can lend SOL or USDC as quote tokens. You'll earn interest when borrowers use these funds for leveraged positions against various collateral tokens like ETH, BTC, and other supported assets."
		},
		{
			id: 4,
			category: 'returns',
			categoryLabel: 'Returns & Earnings',
			question: "What returns can I expect?",
			answer: "Interest rates typically range from 20-100% APR depending on market conditions and the collateral token. Returns vary based on utilization rates, market demand, and the risk profile of borrowers using your offers."
		},
		{
			id: 5,
			category: 'returns',
			categoryLabel: 'Returns & Earnings',
			question: "How is interest calculated and paid?",
			answer: "Interest accrues continuously and compounds automatically. The rate is annualized (APR) but calculated per second. You can track your earnings in real-time through the dashboard and withdraw your profits at any time."
		},
		{
			id: 6,
			category: 'returns',
			categoryLabel: 'Returns & Earnings',
			question: "Can I withdraw my funds anytime?",
			answer: "Yes, you can withdraw available funds anytime. However, funds actively borrowed by traders are locked until positions are closed or liquidated. The dashboard shows your available vs. utilized liquidity."
		},
		{
			id: 7,
			category: 'risks',
			categoryLabel: 'Risks & Safety',
			question: "What are the main risks of lending?",
			answer: "Key risks include smart contract vulnerabilities, market volatility affecting liquidations, liquidation delays during network congestion, and liquidity risks during market stress. All positions are overcollateralized (120-400%) to protect lenders."
		},
		{
			id: 8,
			category: 'risks',
			categoryLabel: 'Risks & Safety',
			question: "How are borrower positions secured?",
			answer: "All borrower positions require overcollateralization of 120-400% depending on the asset. This means borrowers must deposit collateral worth significantly more than the loan amount. If collateral value drops, positions are automatically liquidated to protect lenders."
		},
		{
			id: 9,
			category: 'risks',
			categoryLabel: 'Risks & Safety',
			question: "What happens during liquidations?",
			answer: "When a borrower's position becomes unhealthy (collateral value drops too low), it's automatically liquidated. The collateral is sold to repay the loan plus interest. Any remaining collateral after repayment goes back to the borrower. Lenders receive their principal plus accrued interest."
		},
		{
			id: 10,
			category: 'technical',
			categoryLabel: 'Technical',
			question: "Which wallets are supported?",
			answer: "We support MetaMask, WalletConnect, Phantom (for Solana), and other major Web3 wallets. The platform works on both Solana and BSC networks."
		},
		{
			id: 11,
			category: 'technical',
			categoryLabel: 'Technical',
			question: "Are there any fees?",
			answer: "Lavarage charges a small protocol fee on profits earned from liquidations. There are no fees for creating offers or earning interest. You'll only pay standard network gas fees for transactions."
		},
		{
			id: 12,
			category: 'technical',
			categoryLabel: 'Technical',
			question: "Is the protocol audited?",
			answer: "Yes, Lavarage has undergone multiple security audits by reputable firms. However, smart contracts always carry inherent risks. We recommend starting with small amounts and only lending funds you can afford to lose."
		},
		{
			id: 13,
			category: 'offers',
			categoryLabel: 'Loan Offers',
			question: "How do I set competitive interest rates?",
			answer: "Check the current market rates on the offers page and set your rate competitively. Higher rates attract borrowers but may indicate higher risk. Consider the collateral token's volatility and current market conditions when setting rates."
		},
		{
			id: 14,
			category: 'offers',
			categoryLabel: 'Loan Offers',
			question: "Can I modify my offers after creation?",
			answer: "You can update some parameters like interest rates and maximum exposure. However, changes only apply to new positions - existing borrower positions maintain their original terms until closed."
		},
		{
			id: 15,
			category: 'offers',
			categoryLabel: 'Loan Offers',
			question: "What's the minimum amount I can lend?",
			answer: "There's no protocol minimum, but you'll need enough to cover gas fees and make the position economically viable. Most lenders start with at least 0.1 SOL or $50 USDC to test the platform."
		}
	];
	
	const allCategories = [
		{ value: 'all', label: 'All Questions' },
		{ value: 'getting-started', label: 'Getting Started' },
		{ value: 'returns', label: 'Returns & Earnings' },
		{ value: 'risks', label: 'Risks & Safety' },
		{ value: 'offers', label: 'Loan Offers' },
		{ value: 'technical', label: 'Technical' }
	];
	
	$: filteredFAQs = faqData.filter(item => {
		const matchesSearch = !searchQuery || 
			item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
			item.answer.toLowerCase().includes(searchQuery.toLowerCase());
		
		const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
		
		return matchesSearch && matchesCategory;
	});
	
	function toggleItem(id) {
		if (openItems.has(id)) {
			openItems.delete(id);
		} else {
			openItems.add(id);
		}
		openItems = openItems; // Trigger reactivity
	}
	
	function openAll() {
		openItems = new Set(filteredFAQs.map(item => item.id));
	}
	
	function closeAll() {
		openItems = new Set();
	}
</script>

<div class="bg-white">
	{#if variant === 'full'}
		<!-- Header -->
		<div class="text-center mb-8">
			<div class="flex justify-center mb-4">
				<div class="p-3 bg-blue-50 rounded-full">
					<HelpCircle class="w-8 h-8 text-blue-600" />
				</div>
			</div>
			<h2 class="text-3xl font-bold text-gray-900 mb-4">
				Frequently Asked Questions
			</h2>
			<p class="text-gray-600 max-w-2xl mx-auto">
				Find answers to common questions about Lavarage lending, risks, and returns
			</p>
		</div>
	{/if}
	
	<!-- Search and Filters -->
	{#if searchable || categories}
		<div class="mb-8 space-y-4">
			{#if searchable}
				<!-- Search -->
				<div class="relative max-w-md mx-auto">
					<Search class="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
					<input
						type="text"
						bind:value={searchQuery}
						placeholder="Search questions..."
						class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
					/>
				</div>
			{/if}
			
			{#if categories}
				<!-- Category Filter -->
				<div class="flex flex-wrap justify-center gap-2">
					{#each allCategories as category}
						<button
							class="px-4 py-2 rounded-lg text-sm font-medium transition-colors {
								selectedCategory === category.value 
									? 'bg-blue-600 text-white' 
									: 'bg-gray-100 text-gray-700 hover:bg-gray-200'
							}"
							on:click={() => selectedCategory = category.value}
						>
							{category.label}
						</button>
					{/each}
				</div>
			{/if}
			
			<!-- Expand/Collapse All -->
			{#if variant === 'full'}
				<div class="flex justify-center space-x-4">
					<button
						class="text-blue-600 hover:text-blue-800 text-sm font-medium"
						on:click={openAll}
					>
						Expand All
					</button>
					<span class="text-gray-400">|</span>
					<button
						class="text-blue-600 hover:text-blue-800 text-sm font-medium"
						on:click={closeAll}
					>
						Collapse All
					</button>
				</div>
			{/if}
		</div>
	{/if}
	
	<!-- FAQ Items -->
	<div class="max-w-4xl mx-auto">
		{#if filteredFAQs.length === 0}
			<div class="text-center py-12">
				<HelpCircle class="w-12 h-12 text-gray-300 mx-auto mb-4" />
				<h3 class="text-lg font-medium text-gray-900 mb-2">No questions found</h3>
				<p class="text-gray-500">Try adjusting your search or category filter</p>
			</div>
		{:else}
			<div class="space-y-4">
				{#each filteredFAQs as item (item.id)}
					<div class="border border-gray-200 rounded-lg overflow-hidden">
						<!-- Question -->
						<button
							class="w-full px-6 py-4 text-left bg-white hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-inset"
							on:click={() => toggleItem(item.id)}
						>
							<div class="flex items-center justify-between">
								<div class="flex-1">
									{#if categories && variant === 'full'}
										<span class="inline-block px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full mb-2">
											{item.categoryLabel}
										</span>
									{/if}
									<h3 class="text-lg font-medium text-gray-900 pr-4">
										{item.question}
									</h3>
								</div>
								<ChevronDown 
									class="w-5 h-5 text-gray-500 transition-transform duration-200 flex-shrink-0 {
										openItems.has(item.id) ? 'rotate-180' : ''
									}" 
								/>
							</div>
						</button>
						
						<!-- Answer -->
						{#if openItems.has(item.id)}
							<div 
								class="px-6 py-4 bg-gray-50 border-t border-gray-200"
								transition:slide={{ duration: 200 }}
							>
								<p class="text-gray-700 leading-relaxed">
									{item.answer}
								</p>
							</div>
						{/if}
					</div>
				{/each}
			</div>
		{/if}
	</div>
	
	{#if variant === 'full'}
		<!-- Contact Support -->
		<div class="mt-12 text-center">
			<div class="bg-blue-50 rounded-xl p-8">
				<h3 class="text-xl font-bold text-gray-900 mb-2">
					Still have questions?
				</h3>
				<p class="text-gray-600 mb-6">
					Our team is here to help you get started with Lavarage lending
				</p>
				<div class="flex flex-col sm:flex-row gap-4 justify-center">
					<button class="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors">
						Join Discord Community
					</button>
					<button class="px-6 py-3 border border-blue-600 text-blue-600 rounded-lg font-medium hover:bg-blue-50 transition-colors">
						Read Documentation
					</button>
				</div>
			</div>
		</div>
	{/if}
</div>