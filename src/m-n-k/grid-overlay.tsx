import { type Component, Show } from 'solid-js'

interface GridOverlaySVGProps {
	m: number
	n: number
	cellSize: number
	offset: { x: number; y: number }
	winner: { coordinates: [number, number][] } | undefined
}

export const GridOverlaySVG: Component<GridOverlaySVGProps> = (props) => {
	const calculateLineCoordinates = () => {
		if (!props.winner) return null

		const start = props.winner.coordinates[0]
		const end = props.winner.coordinates[props.winner.coordinates.length - 1]

		const gapSize = 8 // Equivalent to gap-2 in Tailwind (2 * 4px)
		const calculateCellCenter = (index: number) =>
			index * (props.cellSize + gapSize) + props.cellSize / 2

		return {
			x1: calculateCellCenter(start[1]),
			y1: calculateCellCenter(start[0]),
			x2: calculateCellCenter(end[1]),
			y2: calculateCellCenter(end[0]),
		}
	}

	return (
		<svg class="absolute pointer-events-none left-0 top-0 w-full h-full z-20">
			<title>winner-strikethrough</title>
			<Show when={props.winner}>
				{() => {
					const lineCoords = calculateLineCoordinates()
					return (
						<line
							x1={lineCoords?.x1}
							y1={lineCoords?.y1}
							x2={lineCoords?.x2}
							y2={lineCoords?.y2}
							stroke="red"
							stroke-width="12"
						>
							<animate
								attributeName="stroke-dasharray"
								from="0,1000"
								to="1000,0"
								dur="3s"
								fill="freeze"
							/>
						</line>
					)
				}}
			</Show>
		</svg>
	)
}
