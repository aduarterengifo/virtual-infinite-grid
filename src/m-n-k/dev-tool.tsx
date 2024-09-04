import {
	type Accessor,
	type Component,
	type Setter,
	useContext,
} from 'solid-js'
import { MnkGameContext } from './context'
import { CELL_SIZE } from './m-n-k-game'

type HelperProps = {
	dimensions: Accessor<{
		width: number
		height: number
	}>
	setOffset: Setter<{
		x: number
		y: number
	}>
	debugMode: Accessor<boolean>
	setDebugMode: Setter<boolean>
	offset: Accessor<{ x: number; y: number }>
}

export const GameDevTool: Component<HelperProps> = (props) => {
	const centerGrid = () => {
		const { width, height } = props.dimensions()
		const centerX = Math.floor(width / (2 * CELL_SIZE)) * CELL_SIZE
		const centerY = Math.floor(height / (2 * CELL_SIZE)) * CELL_SIZE
		props.setOffset({ x: centerX, y: centerY })
	}

	return (
		<div class="absolute top-4 right-4 flex gap-4 z-10">
			<div class="flex gap-4">
				<button
					type="button"
					class="bg-black text-white px-4 py-2 h-10"
					onClick={centerGrid}
				>
					Center Grid
				</button>
				<button
					type="button"
					class=" bg-black text-white px-4 py-2 h-10"
					onClick={() => props.setDebugMode(!props.debugMode())}
				>
					{props.debugMode() ? 'Disable Debug' : 'Enable Debug'}
				</button>
			</div>
		</div>
	)
}
