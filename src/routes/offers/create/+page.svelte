<script>
	import { goto } from '$app/navigation';
	import { isConnected, address } from '../../../lib/stores/wallet.js';
	import { createOffer } from '../../../lib/stores/lender.js';
	import { ArrowLeft, Info, DollarSign } from 'lucide-svelte';
	import LoadingSpinner from '../../../lib/components/LoadingSpinner.svelte';

	let formData = {
		collateralToken: '',
		maxExposure: '',
		interestRate: '',
		quoteToken: 'So11111111111111111111111111111111111111112' // SOL
	};

	let isSubmitting = false;
	let errors = {};
	let showSuccess = false;

	// Common token addresses for Solana
	const commonTokens = [
		{ symbol: 'SOL', address: 'So11111111111111111111111111111111111111112', name: 'Solana' },
		{ symbol: 'USDC', address: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v', name: 'USD Coin' },
		{ symbol: 'USDT', address: 'Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB', name: 'Tether USD' },
		{ symbol: 'BTC', address: '9n4nbM75f5Ui33ZbPYXn59EwSgE8CGsHtAeTH5YFeJ9E', name: 'Bitcoin (Portal)' },
		{ symbol: 'ETH', address: '7vfCXTUXx5WJV5JADk17DUJ4ksgau7utNKj4b963voxs', name: 'Ethereum (Portal)' }
	];

	function validateForm() {
		errors = {};

		if (!formData.collateralToken.trim()) {
			errors.collateralToken = 'Collateral token address is required';
		}

		if (!formData.maxExposure || parseFloat(formData.maxExposure) <= 0) {
			errors.maxExposure = 'Max exposure must be greater than 0';
		}

		if (!formData.interestRate || parseFloat(formData.interestRate) <= 0) {
			errors.interestRate = 'Interest rate must be greater than 0';
		} else if (parseFloat(formData.interestRate) > 1000) {
			errors.interestRate = 'Interest rate seems too high (max 1000%)';
		}

		return Object.keys(errors).length === 0;
	}

	async function handleSubmit() {
		if (!validateForm()) return;
		if (!$address) return;

		isSubmitting = true;

		try {
			const offerData = {
				collateralToken: formData.collateralToken.trim(),
				maxExposure: parseFloat(formData.maxExposure),
				interestRate: parseFloat(formData.interestRate) * 100, // Convert to basis points
				userWallet: $address,
				quoteToken: formData.quoteToken
			};

			const result = await createOffer(offerData);
			console.log('Offer created:', result);
			
			showSuccess = true;
			setTimeout(() => {
				goto('/offers');
			}, 2000);
			
		} catch (error) {
			console.error('Error creating offer:', error);
			errors.submit = error.message || 'Failed to create offer';
		} finally {
			isSubmitting = false;
		}
	}

	function selectToken(tokenAddress) {
		formData.collateralToken = tokenAddress;
	}
</script>

<svelte:head>
	<title>Create Loan Offer - Lavarage Lender</title>
</svelte:head>

<div class="max-w-2xl mx-auto space-y-6">
	<!-- Header -->
	<div class="flex items-center space-x-4">
		<a href="/offers" class="btn btn-secondary p-2">
			<ArrowLeft class="w-5 h-5" />
		</a>
		<div>
			<h1 class="text-3xl font-bold text-gray-900">Create Loan Offer</h1>
			<p class="text-gray-600">Set up a new lending offer to earn yield</p>
		</div>
	</div>

	{#if !$isConnected}
		<div class="card text-center py-12">
			<div class="w-16 h-16 bg-warning-100 rounded-full flex items-center justify-center mx-auto mb-4">
				<Info class="w-8 h-8 text-warning-600" />
			</div>
			<h2 class="text-xl font-semibold text-gray-900 mb-2">Wallet Not Connected</h2>
			<p class="text-gray-600">Please connect your wallet to create a loan offer</p>
		</div>
	{:else if showSuccess}
		<div class="card text-center py-12">
			<div class="w-16 h-16 bg-success-100 rounded-full flex items-center justify-center mx-auto mb-4">
				<DollarSign class="w-8 h-8 text-success-600" />
			</div>
			<h2 class="text-xl font-semibold text-gray-900 mb-2">Offer Created Successfully!</h2>
			<p class="text-gray-600">Redirecting to your offers...</p>
			<LoadingSpinner class="mt-4" />
		</div>
	{:else}
		<form on:submit|preventDefault={handleSubmit} class="space-y-6">
			<!-- Information Card -->
			<div class="card bg-primary-50 border-primary-200">
				<div class="flex items-start space-x-3">
					<Info class="w-5 h-5 text-primary-600 mt-0.5" />
					<div class="text-sm text-primary-800">
						<p class="font-medium mb-1">How it works:</p>
						<ul class="space-y-1 text-primary-700">
							<li>• Create an offer specifying which token you'll accept as collateral</li>
							<li>• Set your desired interest rate and maximum exposure</li>
							<li>• Borrowers can use your liquidity for leveraged positions</li>
							<li>• Earn interest on borrowed funds automatically</li>
						</ul>
					</div>
				</div>
			</div>

			<!-- Form Fields -->
			<div class="card space-y-6">
				<!-- Quote Token Selection -->
				<div>
					<label class="block text-sm font-medium text-gray-700 mb-2">
						Quote Token (Currency)
					</label>
					<select bind:value={formData.quoteToken} class="input">
						<option value="So11111111111111111111111111111111111111112">SOL</option>
						<option value="EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v">USDC</option>
					</select>
					<p class="text-sm text-gray-500 mt-1">
						The currency you'll lend out to borrowers
					</p>
				</div>

				<!-- Collateral Token -->
				<div>
					<label class="block text-sm font-medium text-gray-700 mb-2">
						Collateral Token Address
					</label>
					<input
						type="text"
						bind:value={formData.collateralToken}
						class="input {errors.collateralToken ? 'border-error-500' : ''}"
						placeholder="Enter token mint address..."
					/>
					{#if errors.collateralToken}
						<p class="text-sm text-error-600 mt-1">{errors.collateralToken}</p>
					{/if}
					
					<!-- Common Tokens -->
					<div class="mt-3">
						<p class="text-sm text-gray-600 mb-2">Popular tokens:</p>
						<div class="flex flex-wrap gap-2">
							{#each commonTokens as token}
								<button
									type="button"
									on:click={() => selectToken(token.address)}
									class="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors
										{formData.collateralToken === token.address ? 'bg-primary-100 text-primary-700' : 'text-gray-700'}"
								>
									{token.symbol}
								</button>
							{/each}
						</div>
					</div>
				</div>

				<!-- Max Exposure -->
				<div>
					<label class="block text-sm font-medium text-gray-700 mb-2">
						Maximum Exposure ({formData.quoteToken.includes('So111') ? 'SOL' : 'USDC'})
					</label>
					<input
						type="number"
						step="0.1"
						min="0"
						bind:value={formData.maxExposure}
						class="input {errors.maxExposure ? 'border-error-500' : ''}"
						placeholder="1000"
					/>
					{#if errors.maxExposure}
						<p class="text-sm text-error-600 mt-1">{errors.maxExposure}</p>
					{/if}
					<p class="text-sm text-gray-500 mt-1">
						Total amount available for lending across all borrowers
					</p>
				</div>

				<!-- Interest Rate -->
				<div>
					<label class="block text-sm font-medium text-gray-700 mb-2">
						Annual Interest Rate (%)
					</label>
					<input
						type="number"
						step="0.1"
						min="0"
						max="1000"
						bind:value={formData.interestRate}
						class="input {errors.interestRate ? 'border-error-500' : ''}"
						placeholder="15.5"
					/>
					{#if errors.interestRate}
						<p class="text-sm text-error-600 mt-1">{errors.interestRate}</p>
					{/if}
					<p class="text-sm text-gray-500 mt-1">
						Interest rate charged to borrowers (competitive rates: 10-50%)
					</p>
				</div>

				<!-- Submit Error -->
				{#if errors.submit}
					<div class="bg-error-50 border border-error-200 rounded-lg p-4">
						<p class="text-error-700 text-sm">{errors.submit}</p>
					</div>
				{/if}
			</div>

			<!-- Submit Button -->
			<div class="flex space-x-4">
				<button
					type="submit"
					disabled={isSubmitting}
					class="btn btn-primary flex-1 flex items-center justify-center space-x-2"
				>
					{#if isSubmitting}
						<LoadingSpinner size="sm" color="white" />
						<span>Creating Offer...</span>
					{:else}
						<DollarSign class="w-4 h-4" />
						<span>Create Loan Offer</span>
					{/if}
				</button>
				
				<a href="/offers" class="btn btn-secondary flex items-center space-x-2">
					<span>Cancel</span>
				</a>
			</div>
		</form>
	{/if}
</div>