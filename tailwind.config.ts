import sharedConfig from './internal-tailwind.config'
import type { Config } from 'tailwindcss'

const config: Pick<Config, 'prefix' | 'presets' | 'content'> = {
	content: ['./src/**/*.{js,jsx,ts,tsx}'],
	presets: [sharedConfig],
}
export default config
