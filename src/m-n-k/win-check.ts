import * as tf from '@tensorflow/tfjs'

export type Coordinate2D = [number, number]

export type WinningPosition = {
	start: Coordinate2D
	end: Coordinate2D
}

export const checkWinner = (
	board: tf.Tensor2D,
	m: number,
	n: number,
	k: number,
	lastMove: { x: number; y: number },
): WinningPosition | null => {
	const { x, y } = lastMove
	const player = board.bufferSync().get(x, y) as 1 | 2

	const checkLine = (
		line: tf.Tensor1D,
		startRow: number,
		startCol: number,
		direction: WinningPosition['direction'],
	): WinningPosition | null => {
		const values = line.arraySync()
		let count = 0
		const targetCount = k

		for (let i = 0; i < values.length; i++) {
			if (values[i] === player) {
				count++
				if (count === targetCount) {
					return {
						player,
						startRow: startRow + (direction === 'vertical' ? i - k + 1 : 0),
						startCol: startCol + (direction === 'horizontal' ? i - k + 1 : 0),
						direction,
					}
				}
			} else {
				count = 0
			}
		}
		return null
	}

	// Define the range to check
	const startRow = Math.max(0, x - k + 1)
	const endRow = Math.min(m - 1, x + k - 1)
	const startCol = Math.max(0, y - k + 1)
	const endCol = Math.min(n - 1, y + k - 1)

	// Check horizontal
	const row = board
		.slice([x, startCol], [1, endCol - startCol + 1])
		.reshape([endCol - startCol + 1]) as tf.Tensor1D
	let result = checkLine(row, x, startCol, 'horizontal')
	if (result) return result

	// Check vertical
	const col = board
		.slice([startRow, y], [endRow - startRow + 1, 1])
		.reshape([endRow - startRow + 1]) as tf.Tensor1D
	result = checkLine(col, startRow, y, 'vertical')
	if (result) return result

	// Check main diagonal
	const diagLength = Math.min(endRow - startRow, endCol - startCol) + 1
	const diag = tf.tensor1d(
		Array.from({ length: diagLength }, (_, i) =>
			board.bufferSync().get(startRow + i, startCol + i),
		),
	)
	result = checkLine(diag, startRow, startCol, 'diagonal')
	if (result) return result

	// Check anti-diagonal
	const antiDiagLength = Math.min(endRow - startRow, endCol - startCol) + 1
	const antiDiag = tf.tensor1d(
		Array.from({ length: antiDiagLength }, (_, i) =>
			board.bufferSync().get(startRow + i, endCol - i),
		),
	)
	result = checkLine(antiDiag, startRow, endCol, 'antidiagonal')
	if (result) return result

	return null
}
