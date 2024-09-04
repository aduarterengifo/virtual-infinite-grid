import type { Coordinate2D } from '../pure'
import { nthArrayInStack } from '../tensors'
import * as tf from '@tensorflow/tfjs'
import { type ParentComponent, createEffect, createMemo } from 'solid-js'
import { createStore } from 'solid-js/store'
import { MnkGameContext } from './context'

export type SpaceState = 0 | 1 | 2

export type ActiveSpaceState = Exclude<SpaceState, 0>

export type GameStatus = 'idle' | 'active' | 'finished'

export const stateToMark = (spaceState: ActiveSpaceState) =>
	spaceState === 1 ? 'X' : 'O'

export type MnkGameStore = {
	m: number
	n: number
	k: number
	counter: number
	state: tf.Tensor2D
	history: tf.Tensor3D
	winner?: { player: ActiveSpaceState; coordinates: Coordinate2D[] }
	last?: Coordinate2D
	status: GameStatus
}
export const INITIAL_M = 3
export const INITIAL_N = 3
export const INITIAL_K = 3
export const INITIAL_GAME_STATE = tf.tensor2d(
	Array<SpaceState>(INITIAL_M * INITIAL_N).fill(0),
	[INITIAL_M, INITIAL_N],
)

export const getCurrentMark = (gameCounter: number) =>
	gameCounter % 2 === 0 ? 1 : 2

export const GameContextProvider: ParentComponent = (props) => {
	const [store, setStore] = createStore<MnkGameStore>({
		m: INITIAL_M,
		n: INITIAL_N,
		k: INITIAL_K,
		counter: 0,
		state: INITIAL_GAME_STATE,
		history: tf.stack([INITIAL_GAME_STATE.clone()]) as tf.Tensor3D,
		status: 'idle',
	})

	const currentBoard = createMemo(() =>
		nthArrayInStack(store.history, store.history.shape[0] - 1),
	)

	const count = createMemo(() => store.history.shape[0] - 1)

	// const currentElement = createMemo(() => store.history.shape[0] - 1)

	return (
		<MnkGameContext.Provider value={{ store, currentBoard, count, setStore }}>
			{props.children}
		</MnkGameContext.Provider>
	)
}
