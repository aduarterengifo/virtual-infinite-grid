import * as tf from '@tensorflow/tfjs'
import type { Coordinate2D } from './win-check'

type Player = 1 | 2

const directions = [
	'horizontal',
	'vertical',
	'diagonal',
	'anti-diagonal',
] as const

export const checkWinnerConv2 = (
	board: tf.Tensor2D,
	m: number,
	n: number,
	k: number,
	player: Player,
	lastMove: Coordinate2D,
): Coordinate2D[] | null => {
	const [x, y] = lastMove

	// Use tf.tidy to automatically clean up tensors
	return tf.tidy(() => {
		const kernels = [
			tf.ones([1, k]), // horizontal
			tf.ones([k, 1]), // vertical
			tf.eye(k), // diagonal
			tf.reverse(tf.eye(k), 0), // anti-diagonal
		]

		// Define the range to check
		const x0 = Math.max(0, x - k + 1)
		const xN = Math.min(m - 1, x + k - 1)
		const y0 = Math.max(0, y - k + 1)
		const yN = Math.min(n - 1, y + k - 1)

		const subBoard = board.slice([x0, y0], [xN - x0 + 1, yN - y0 + 1])

		const playerBoard = tf.where(
			tf.equal(subBoard, player),
			tf.ones(subBoard.shape),
			tf.zeros(subBoard.shape),
		)

		for (let i = 0; i < kernels.length; i++) {
			const result = checkKernel(
				playerBoard,
				kernels[i],
				k,
				x0,
				y0,
				player,
				directions[i],
			)
			if (result) return result
		}

		return null
	})
}

function checkKernel(
	playerBoard: tf.Tensor2D,
	kernel: tf.Tensor2D,
	k: number,
	x0: number,
	y0: number,
	player: Player,
	direction: (typeof directions)[number],
): Coordinate2D[] | null {
	const result = tf.conv2d(
		playerBoard.reshape([1, playerBoard.shape[0], playerBoard.shape[1], 1]),
		kernel.reshape([kernel.shape[0], kernel.shape[1], 1, 1]),
		1,
		'valid',
	)

	const maxVal = result.max()
	if (maxVal.dataSync()[0] === k) {
		const flatResult = result.reshape([-1])
		const maxIndex = flatResult.argMax()

		const resultWidth = result.shape[2]
		const winRow = tf.floor(maxIndex.div(resultWidth))
		const winCol = maxIndex.mod(resultWidth)

		const row0 = x0 + winRow.dataSync()[0]
		let col0 = y0 + winCol.dataSync()[0]

		let rowN = row0
		let colN = col0

		switch (direction) {
			case 'horizontal':
				colN += k - 1
				break
			case 'vertical':
				rowN += k - 1
				break
			case 'diagonal':
				rowN += k - 1
				colN += k - 1
				break
			case 'anti-diagonal':
				rowN += k - 1
				col0 += k - 1
				break
		}

		return [
			[row0, col0],
			[rowN, colN],
		]
	}

	return null
}
