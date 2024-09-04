import * as tf from '@tensorflow/tfjs'
import { type ParentComponent, batch, useContext } from 'solid-js'
import { MnkGameContext } from './context'
import type { SpaceState } from './context-provider'

export const Menu: ParentComponent = () => {
	const { store, setStore } = useContext(MnkGameContext)!

	return (
		<div class="absolute top-4 left-4 flex gap-4 z-10">
			<div class="grid grid-cols-max-1fr grid-rows-3 gap-4 text-foreground w-32">
				<div class="rounded-full h-12 w-12 bg-amber-50 flex items-center justify-center shadow-xl">
					<div>m</div>
				</div>
				<input
					type="number"
					class="rounded-lg bg-amber-50 shadow-xl h-12 flex items-center justify-center  px-4"
					min={1}
					value={store.m}
					disabled={store.status !== 'idle'}
					onChange={(e) => {
						const value = Number((e.target as HTMLInputElement).value)
						batch(() => {
							const newHistory = tf.stack([
								tf.tensor2d(Array<SpaceState>(value * store.n).fill(0), [
									value,
									store.n,
								]),
							]) as tf.Tensor3D

							setStore('history', () => newHistory)
							setStore('m', () => value)
						})
					}}
				/>
				<div class="rounded-full h-12 w-12 bg-amber-50 flex items-center justify-center shadow-xl">
					<div>n</div>
				</div>
				<input
					type="number"
					class="rounded-lg bg-amber-50 shadow-xl h-12 flex items-center justify-center  px-4"
					min={1}
					value={store.n}
					disabled={store.status !== 'idle'}
					onChange={(e) => {
						const value = Number((e.target as HTMLInputElement).value)

						batch(() => {
							const newHistory = tf.stack([
								tf.tensor2d(Array<SpaceState>(value * store.m).fill(0), [
									store.m,
									value,
								]),
							]) as tf.Tensor3D

							setStore('history', () => newHistory)
							setStore('n', () => value)
						})
					}}
				/>
				<div class="rounded-full h-12 w-12 bg-amber-50 flex items-center justify-center shadow-xl">
					<div>k</div>
				</div>
				<input
					type="number"
					class="rounded-lg bg-amber-50 shadow-xl h-12 flex items-center justify-center px-4"
					min={1}
					value={store.k}
					disabled={store.status !== 'idle'}
					onChange={(e) => {
						const value = Number((e.target as HTMLInputElement).value)
						setStore('k', () => value)
					}}
				/>
			</div>
			<div class="bg-amber-50 text-black h-10 shadow-xl px-4 flex gap-4">
				<pre>{JSON.stringify(store.winner, null, 2)}</pre>
			</div>
			{/* <button
				type="button"
				class="rounded-lg bg-amber-50 shadow-xl h-12 w-32 flex items-center justify-center text-foreground"
				onClick={() =>
					setStore('status', (prev) => (prev === 'idle' ? 'active' : 'idle'))

				}
			>
				{store.status === 'idle' ? 'Start' : 'Reset'}
			</button> */}
		</div>
	)
}
