import type * as tf from '@tensorflow/tfjs'
import { type Accessor, createContext } from 'solid-js'
import type { SetStoreFunction } from 'solid-js/store'
import type { MnkGameStore } from './context-provider'

export const MnkGameContext = createContext<{
	currentBoard: Accessor<tf.Tensor2D>
	count: Accessor<number>
	store: MnkGameStore
	setStore: SetStoreFunction<MnkGameStore>
}>()
