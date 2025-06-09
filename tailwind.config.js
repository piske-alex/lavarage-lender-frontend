/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	theme: {
		extend: {
			colors: {
				primary: {
					50: '#f0f9ff',
					500: '#3b82f6',
					600: '#2563eb',
					700: '#1d4ed8',
					900: '#1e3a8a'
				},
				success: {
					500: '#10b981',
					600: '#059669'
				},
				warning: {
					500: '#f59e0b',
					600: '#d97706'
				},
				error: {
					500: '#ef4444',
					600: '#dc2626'
				}
			},
			animation: {
				'pulse-slow': 'pulse 3s infinite',
				'bounce-slow': 'bounce 2s infinite'
			}
		}
	},
	plugins: []
};