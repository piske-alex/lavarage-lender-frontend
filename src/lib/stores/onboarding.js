import { writable } from 'svelte/store';

// Onboarding state management
export const showWelcomeModal = writable(false);
export const showRiskDisclosure = writable(false);
export const onboardingCompleted = writable(false);
export const riskAcknowledged = writable(false);

// Check if user has completed onboarding
function checkOnboardingStatus() {
	if (typeof localStorage === 'undefined') return false;
	
	const completed = localStorage.getItem('lavarage_onboarding_completed');
	const skipped = localStorage.getItem('lavarage_onboarding_skipped');
	const risk = localStorage.getItem('lavarage_risk_acknowledged');
	
	onboardingCompleted.set(completed === 'true' || skipped === 'true');
	riskAcknowledged.set(!!risk);
	
	return completed === 'true' || skipped === 'true';
}

// Initialize onboarding for new users
export function initializeOnboarding() {
	const hasCompletedOnboarding = checkOnboardingStatus();
	
	// Show welcome modal for new users
	if (!hasCompletedOnboarding) {
		setTimeout(() => {
			showWelcomeModal.set(true);
		}, 1000); // Delay to ensure page is loaded
	}
}

// Check if risk disclosure should be shown before first offer creation
export function shouldShowRiskDisclosure() {
	if (typeof localStorage === 'undefined') return true;
	
	const acknowledged = localStorage.getItem('lavarage_risk_acknowledged');
	if (!acknowledged) return true;
	
	try {
		const data = JSON.parse(acknowledged);
		// Check if acknowledgment is less than 30 days old
		const thirtyDaysAgo = Date.now() - (30 * 24 * 60 * 60 * 1000);
		return data.timestamp < thirtyDaysAgo;
	} catch {
		return true;
	}
}

// Show risk disclosure modal
export function triggerRiskDisclosure() {
	showRiskDisclosure.set(true);
}

// Mark onboarding as completed
export function completeOnboarding() {
	localStorage.setItem('lavarage_onboarding_completed', 'true');
	onboardingCompleted.set(true);
	showWelcomeModal.set(false);
}

// Mark risk as acknowledged
export function acknowledgeRisk() {
	const data = {
		timestamp: Date.now(),
		version: '1.0'
	};
	localStorage.setItem('lavarage_risk_acknowledged', JSON.stringify(data));
	riskAcknowledged.set(true);
	showRiskDisclosure.set(false);
}

// Reset onboarding (for testing)
export function resetOnboarding() {
	localStorage.removeItem('lavarage_onboarding_completed');
	localStorage.removeItem('lavarage_onboarding_skipped');
	localStorage.removeItem('lavarage_risk_acknowledged');
	onboardingCompleted.set(false);
	riskAcknowledged.set(false);
}

// Track user interactions for analytics
export function trackOnboardingEvent(event, data = {}) {
	// This would integrate with your analytics service
	console.log('Onboarding Event:', event, data);
	
	// Example events:
	// - 'welcome_modal_shown'
	// - 'welcome_modal_completed'
	// - 'welcome_modal_skipped'
	// - 'risk_disclosure_shown'
	// - 'risk_disclosure_accepted'
	// - 'faq_viewed'
	// - 'how_it_works_viewed'
}