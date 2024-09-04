import type { Config } from 'tailwindcss'

const config: Omit<Config, 'content'> = {
	theme: {
		extend: {
			colors: {
				'richter-gray': 'oklch(var(--r-gray) / <alpha-value>)',
				'r-gray-10': 'oklch(var(--r-gray-10) / <alpha-value>)',
				'r-gray-20': 'oklch(var(--r-gray-20) / <alpha-value>)',
				'r-gray-30': 'oklch(var(--r-gray-30) / <alpha-value>)',
				'r-gray-40': 'oklch(var(--r-gray-40) / <alpha-value>)',
				'r-gray-50': 'oklch(var(--r-gray-50) / <alpha-value>)',
				'r-gray-60': 'oklch(var(--r-gray-60) / <alpha-value>)',
				'r-gray-70': 'oklch(var(--r-gray-70) / <alpha-value>)',
				'r-gray-80': 'oklch(var(--r-gray-80) / <alpha-value>)',
				'r-gray-90': 'oklch(var(--r-gray-90) / <alpha-value>)',
				'r-gray-100': 'oklch(var(--r-gray-100) / <alpha-value>)',
				'int-orange-space': 'oklch(var(--international-orange-aerospace))',
				'int-orange-golden-gate-bridge':
					'oklch(var(--international-orange-golden-gate-bridge))',
				'int-orange-engineering':
					'oklch(var(--international-orange-engineering))',
				'tufte-cream': 'oklch(var(--tufte-cream))',
				'pure-red': 'oklch(var(--pure-red))',
			},
			gridTemplateColumns: {
				'max-1fr': 'max-content minmax(0, 1fr)',
				'max-1fr-max': 'max-content minmax(0, 1fr) max-content',
				'1fr-max': 'minmax(0, 1fr) max-content',
				'auto-fit-w-64': 'repeat( auto-fit, minmax(16rem, 1fr) )',
				'main-grid':
					'[full-start] var(--full) [feature-start] var(--feature) [popout-start] var(--popout) [content-start] var(--content) [content-end] var(--popout) [popout-end] var(--feature) [feature-end] var(--full) [full-end]',
			},
			gridTemplateRows: {
				'max-1fr': 'max-content minmax(0, 1fr)',
				'1fr-max': 'minmax(0, 1fr) max-content',
				'max-max-1fr': 'max-content max-content minmax(0, 1fr)',
			},
			gridColumn: {
				content: 'content',
				popout: 'popout',
				feature: 'feature',
				full: 'full',
				sidebar: 'content-end / feature-end',
			},
			gridColumnStart: {
				'content-end': 'content-end',
			},
			gridColumnEnd: {
				'feature-end': 'feature-end',
			},
			backdropBlur: {
				xxs: '1px',
				xs: '2px',
			},
			width: {
				'406': '406px',
				'290': '290px',
				content: 'var(--content)',
				'bound-80ch': 'var(--bound-80ch)',
				'bound-60ch': 'var(--bound-60ch)',
				'bound-40ch': 'var(--bound-40ch)',
			},
		},
	},
	presets: [
		require('./shdcn-tailwind.config'),
	],
	plugins: [require('tailwindcss-bg-patterns')],
}

export default config
