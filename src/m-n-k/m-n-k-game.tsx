import {
	For,
	createEffect,
	createMemo,
	createSignal,
	onCleanup,
} from 'solid-js'
import { MiniMap } from '../mini-map'
import { Helper } from '../pages/helper'
import { GridColor } from '../pages/infinite-grid/grid-color'
import { quotient } from '../utils/quotient'
import { GameContextProvider } from './context-provider'
import { GameDevTool } from './dev-tool'
import { MnkGameGrid } from './grid'
import { Menu } from './menu'

export const CELL_SIZE = 100 // px
const BUFFER = 2 // number of extra rows/columns to render outside the viewport

const colorCache = new Map()

const getCachedColor = (key: string) => {
	if (!colorCache.has(key)) {
		const l = 0.5 + Math.random() * 0.3
		const c = 0.1 + Math.random() * 0.15
		const h = Math.random() * 360
		colorCache.set(key, `oklch(${l} ${c} ${h})`)
	}
	return colorCache.get(key)
}

const CenteredItem = (props: { offset: { x: number; y: number } }) => {
	return (
		<div
			class="absolute w-10 h-10 bg-red-500 rounded-full"
			style={{
				transform: `translate(${-props.offset.x}px, ${-props.offset.y}px)`,
				left: '50%',
				top: '50%',
				'margin-left': '-20px',
				'margin-top': '-20px',
			}}
		/>
	)
}

export const MnKGame = () => {
	const [pixelOffset, setPixelOffset] = createSignal({ x: 0, y: 0 })
	const [cartesianOffset, setCartesianOffset] = createSignal({ x: 0, y: 0 })

	const [viewportPixelDimensions, setViewportPixelDimensions] = createSignal({
		width: 0,
		height: 0,
	})
	const [isDragging, setIsDragging] = createSignal(false)
	const [debugMode, setDebugMode] = createSignal(false)

	const [exploredDimensions, setExploredDimensions] = createSignal({
		minX: 0,
		maxX: 0,
		minY: 0,
		maxY: 0,
		dimX: 0,
		dimY: 0,
	})

	const [viewportDimensions, setViewportDimensions] = createSignal({
		minX: 0,
		maxX: 0,
		minY: 0,
		maxY: 0,
		dimX: 0,
		dimY: 0,
	})

	let containerRef: HTMLDivElement | undefined
	let contentRef: HTMLDivElement | undefined
	let lastTouchPosition = { x: 0, y: 0 }

	createEffect(() => {
		const updateDimensions = () => {
			if (containerRef) {
				setViewportPixelDimensions({
					width: containerRef.offsetWidth,
					height: containerRef.offsetHeight,
				})
			}
		}

		updateDimensions()
		window.addEventListener('resize', updateDimensions)
		onCleanup(() => window.removeEventListener('resize', updateDimensions))
	})

	createMemo(() => {
		setCartesianOffset({
			x: quotient(pixelOffset().x, CELL_SIZE),
			y: quotient(pixelOffset().y, CELL_SIZE),
		})
	})

	createEffect(() => {
		const handleMouseMove = (e: MouseEvent) => {
			if (isDragging()) {
				setPixelOffset((prev) => ({
					x: prev.x + e.movementX,
					y: prev.y + e.movementY,
				}))
			}
		}

		const handleTouchMove = (e: TouchEvent) => {
			e.preventDefault()
			const touch = e.touches[0]
			const movementX = touch.clientX - lastTouchPosition.x
			const movementY = touch.clientY - lastTouchPosition.y
			setPixelOffset((prev) => ({
				x: prev.x + movementX,
				y: prev.y + movementY,
			}))
			lastTouchPosition = { x: touch.clientX, y: touch.clientY }
		}

		const handleMouseUp = () => {
			setIsDragging(false)
		}

		const handleTouchEnd = () => {
			setIsDragging(false)
		}

		window.addEventListener('mousemove', handleMouseMove)
		window.addEventListener('mouseup', handleMouseUp)
		window.addEventListener('touchmove', handleTouchMove, {
			passive: false,
		})
		window.addEventListener('touchend', handleTouchEnd)

		onCleanup(() => {
			window.removeEventListener('mousemove', handleMouseMove)
			window.removeEventListener('mouseup', handleMouseUp)
			window.removeEventListener('touchmove', handleTouchMove)
			window.removeEventListener('touchend', handleTouchEnd)
		})
	})

	const visibleCells = createMemo(() => {
		const { x, y } = pixelOffset()
		const { width, height } = viewportPixelDimensions()
		const minX = Math.floor(-x / CELL_SIZE) - BUFFER
		const maxX = Math.ceil((width - x) / CELL_SIZE) + BUFFER
		const minY = Math.floor(-y / CELL_SIZE) - BUFFER
		const maxY = Math.ceil((height - y) / CELL_SIZE) + BUFFER

		setViewportDimensions({
			minX,
			maxX,
			minY,
			maxY,
			dimX: maxX - minX,
			dimY: maxY - minY,
		})

		setExploredDimensions((prev) => {
			const newMinX = Math.min(prev.minX, minX)
			const newMaxX = Math.max(prev.maxX, maxX)
			const newMinY = Math.min(prev.minY, minY)
			const newMaxY = Math.max(prev.maxY, maxY)
			return {
				minX: newMinX,
				maxX: newMaxX,
				minY: newMinY,
				maxY: newMaxY,
				dimX: newMaxX - newMinX,
				dimY: newMaxY - newMinY,
			}
		})
		const cells = []

		for (let row = minY; row < maxY; row++) {
			for (let col = minX; col < maxX; col++) {
				const key = `${row},${col}`
				cells.push({
					left: col * CELL_SIZE,
					top: row * CELL_SIZE,
					key: `${row},${col}`,
					color: getCachedColor(`${row},${col}`),
				})
			}
		}
		return cells
	})

	return (
		<GameContextProvider>
			<div
				ref={containerRef}
				class={`top-0 left-0 w-screen h-screen absolute touch-none select-none ${
					isDragging() ? 'cursor-grabbing' : 'cursor-grab'
				}`}
				onMouseDown={() => setIsDragging(true)}
			>
				<MiniMap
					viewportPixelDimensions={viewportPixelDimensions}
					viewportDimensions={viewportDimensions}
					exploredDimensions={exploredDimensions}
					pixelOffset={pixelOffset}
					cartesianOffset={cartesianOffset}
					cellSize={CELL_SIZE}
				/>
				<Menu />
				<GameDevTool
					dimensions={viewportPixelDimensions}
					setOffset={setPixelOffset}
					debugMode={debugMode}
					setDebugMode={setDebugMode}
					offset={pixelOffset}
				/>
				<div
					class="w-screen h-screen overflow-hidden relative"
					draggable="false"
				>
					<div
						ref={contentRef}
						class="absolute top-0 left-0 h-screen w-screen touch-none"
						draggable="false"
						style={{
							transform: `translate(${pixelOffset().x}px, ${pixelOffset().y}px)`,
						}}
					>
						<For each={visibleCells()}>
							{(cell) => (
								<GridColor
									left={cell.left}
									top={cell.top}
									color={cell.color}
									key={cell.key}
								>
									{debugMode() && (
										<div class="absolute inset-0 flex items-center justify-center text-xs text-white bg-black bg-opacity-50">
											{cell.key}
										</div>
									)}
								</GridColor>
							)}
						</For>
					</div>
					<MnkGameGrid offset={pixelOffset()} />
				</div>
			</div>
		</GameContextProvider>
	)
}
