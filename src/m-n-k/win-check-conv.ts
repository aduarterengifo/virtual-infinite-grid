import * as tf from '@tensorflow/tfjs'
import type { WinningPosition } from './win-check'

type Player = 1 | 2
type Direction = (typeof directions)[number]

const directions = [
	'horizontal',
	'vertical',
	'diagonal',
	'antidiagonal',
] as const

export const checkWinnerConv = (
	board: tf.Tensor2D,
	m: number,
	n: number,
	k: number,
	currentPlayer: Player,
	lastMove: { x: number; y: number },
): WinningPosition | null => {
	const { x: row, y: col } = lastMove
	const playerBoard = tf.cast(tf.equal(board, currentPlayer), 'float32')

	const kernels = [
		tf.ones([1, k]), // horizontal
		tf.ones([k, 1]), // vertical
		tf.eye(k), // diagonal
		tf.reverse(tf.eye(k)), // anti-diagonal
	]

	console.log('board')
	board.print()
	console.log('currentPlayer', currentPlayer)
	console.log('sub-board')
	playerBoard.print()

	// Define the range to check
	const startRow = Math.max(0, row - k + 1)
	const endRow = Math.min(m - 1, row + k - 1)
	const startCol = Math.max(0, col - k + 1)
	const endCol = Math.min(n - 1, col + k - 1)

	const subBoard = playerBoard.slice(
		[startRow, startCol],
		[endRow - startRow + 1, endCol - startCol + 1],
	)

	console.log('sub-board')
	subBoard.print()

	for (let i = 0; i < kernels.length; i++) {
		const result = tf.conv2d(
			subBoard.reshape([1, subBoard.shape[0], subBoard.shape[1], 1]),
			kernels[i].reshape([kernels[i].shape[0], kernels[i].shape[1], 1, 1]),
			1,
			'valid',
		)

		const maxVal = result.max()
		if (maxVal.dataSync()[0] === k) {
			// Reshape result to 2D and find the index of the maximum value
			const flatResult = result.reshape([-1])
			const maxIndex = flatResult.argMax()

			// Calculate row and column from the flat index
			const resultWidth = result.shape[2]
			const winRow = tf.floor(maxIndex.div(resultWidth))
			const winCol = maxIndex.mod(resultWidth)

			return {
				player: currentPlayer,
				startRow: startRow + winRow.dataSync()[0],
				startCol: startCol + winCol.dataSync()[0],
				direction: directions[i],
			}
		}
	}

	return null
}
