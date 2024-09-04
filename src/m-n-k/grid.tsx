import {
	flatArrayIndexTo2DMatrixCoordinates,
	flatArrayIndexToCoordinate2D,
} from '../pure'
import {
	antiDiagonalSubset,
	applyToColumns,
	applyToRows,
	columnSubset,
	mainDiagonalSubset,
	matrixSubset,
	nConsecutive,
	nConsecutiveCollapse,
	rowSubset,
} from '../tensors'
import { tensor2DElement } from '../tensors'
import { setValueAtCoordinates } from '../tensors'
import * as tf from '@tensorflow/tfjs'
import { Index, useTransition } from 'solid-js'
import {
	For,
	type ParentComponent,
	Show,
	batch,
	createEffect,
	useContext,
} from 'solid-js'
import { MnkGameContext } from './context'
import {
	type ActiveSpaceState,
	getCurrentMark,
	stateToMark,
} from './context-provider'
import { GridOverlaySVG } from './grid-overlay'
import { checkWinner } from './win-check'
import { checkWinnerConv } from './win-check-conv'
import { checkWinnerConv2 } from './win-check-conv-2'

// type MnKGridProps = {
// 	m: Accessor<number>
// 	n: Accessor<number>
// 	k: Accessor<number>
// }
export const CELL_SIZE = 100 // px

export const MnkGameGrid: ParentComponent<{
	offset: { x: number; y: number }
}> = (props) => {
	const { store, setStore, count, currentBoard } = useContext(MnkGameContext)!
	const [isPending, startTransition] = useTransition()

	return (
		<div
			class="absolute"
			style={{
				transform: `translate(${-props.offset.x}px, ${-props.offset.y}px)`,
				left: '50%',
				top: '50%',
			}}
		>
			<div class="relative">
				<div
					class="grid place-items-center bg-slate-300 gap-2"
					style={{
						'grid-template-columns': `repeat(${store.m}, ${CELL_SIZE}px)`,
						'grid-template-rows': `repeat(${store.n}, ${CELL_SIZE}px)`,
					}}
				>
					<Index each={[...Array(store.m * store.n)]}>
						{(_, i) => {
							const elementAtClick = () => {
								const { x, y } = flatArrayIndexTo2DMatrixCoordinates(i, store.n)
								return tensor2DElement(currentBoard(), x, y)
							}
							return (
								<div
									class="z-20 hover:backdrop-brightness-95 h-full w-full flex items-center justify-center gap-4 bg-slate-200"
									style={{
										height: `${CELL_SIZE}px`,
										width: `${CELL_SIZE}px`,
										'container-type': 'inline-size',
									}}
									onKeyDown={() => {}}
									onClick={async () => {
										startTransition(async () => {
											// valid move guard
											const [x, y] = flatArrayIndexToCoordinate2D(i, store.n)
											const elementAtClick = tensor2DElement(
												currentBoard(),
												x,
												y,
											)

											if (elementAtClick === 0 && store.status !== 'finished') {
												batch(() => {
													setStore('history', (history) => {
														const newState = setValueAtCoordinates(
															currentBoard(),
															x,
															y,
															getCurrentMark(count()),
														)
														const newHistory = tf.concat(
															[history, newState.expandDims(0)],
															0,
														) as tf.Tensor3D
														return newHistory
													})

													setStore('last', () => {
														return flatArrayIndexToCoordinate2D(i, store.n)
													})
												})

												if (count() - 1 >= store.k) {
													const result = await checkWinnerConv2(
														currentBoard(),
														store.m,
														store.n,
														store.k,
														getCurrentMark(count() - 1),
														flatArrayIndexToCoordinate2D(i, store.n),
													)

													if (result) {
														setStore('winner', {
															player: getCurrentMark(count() - 1),
															coordinates: result,
														})
													}
												}
											}
										})
									}}
								>
									<Show when={elementAtClick() !== 0}>
										<div class="tabular-nums" style={{ 'font-size': '75cqi' }}>
											{stateToMark(elementAtClick() as ActiveSpaceState)}
										</div>
									</Show>
								</div>
								// <div>hey</div>
							)
						}}
					</Index>
				</div>
				<GridOverlaySVG
					m={store.m}
					n={store.n}
					cellSize={CELL_SIZE}
					offset={props.offset}
					winner={store.winner}
				/>
			</div>
		</div>
	)
}
