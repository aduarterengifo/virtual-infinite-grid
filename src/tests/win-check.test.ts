import { describe, expect, test } from 'bun:test'
import * as tf from '@tensorflow/tfjs'
import * as fc from 'fast-check'
import { checkWinnerConv2 } from '../m-n-k/win-check-conv-2'

describe('win-check', () => {
	describe('player 1', () => {
		test('horizontal-win', async () => {
			const m = 3
			const n = 3
			const k = 3
			const board = tf.tensor2d([
				[0, 2, 0],
				[1, 1, 1],
				[0, 2, 0],
			])

			const result = checkWinnerConv2(board, m, n, k, 1, [1, 2])

			expect(result).toEqual(
				expect.arrayContaining([
					[1, 0],
					[1, 2],
				]),
			)
			expect(result).toHaveLength(2)
		})
		test('vertical-win', async () => {
			const m = 3
			const n = 3
			const k = 3
			const board = tf.tensor2d([
				[0, 1, 0],
				[2, 1, 2],
				[0, 1, 0],
			])

			const result = checkWinnerConv2(board, m, n, k, 1, [2, 1])

			expect(result).toEqual(
				expect.arrayContaining([
					[0, 1],
					[2, 1],
				]),
			)
			expect(result).toHaveLength(2)
		})
		test('diagonal-win', async () => {
			const m = 3
			const n = 3
			const k = 3
			const board = tf.tensor2d([
				[1, 2, 0],
				[0, 1, 0],
				[0, 2, 1],
			])

			const result = checkWinnerConv2(board, m, n, k, 1, [2, 2])

			expect(result).toEqual(
				expect.arrayContaining([
					[0, 0],
					[2, 2],
				]),
			)
			expect(result).toHaveLength(2)
		})
	})
	describe('player 2', () => {
		test('horizontal-win', async () => {
			const m = 3
			const n = 3
			const k = 3
			const board = tf.tensor2d([
				[0, 0, 1],
				[2, 2, 2],
				[0, 1, 0],
			])

			const result = checkWinnerConv2(board, m, n, k, 2, [1, 2])

			expect(result).toEqual(
				expect.arrayContaining([
					[1, 0],
					[1, 2],
				]),
			)
			expect(result).toHaveLength(2)
		})
		test('vertical-win', async () => {
			const m = 3
			const n = 3
			const k = 3
			const board = tf.tensor2d([
				[0, 2, 0],
				[1, 2, 1],
				[0, 2, 0],
			])

			const result = checkWinnerConv2(board, m, n, k, 2, [0, 1])

			expect(result).toEqual(
				expect.arrayContaining([
					[0, 1],
					[2, 1],
				]),
			)
			expect(result).toHaveLength(2)
		})
		test('diagonal-win', async () => {
			const m = 3
			const n = 3
			const k = 3
			const board = tf.tensor2d([
				[2, 0, 0],
				[1, 2, 1],
				[1, 2, 2],
			])

			const result = checkWinnerConv2(board, m, n, k, 2, [2, 2])

			expect(result).toEqual(
				expect.arrayContaining([
					[0, 0],
					[2, 2],
				]),
			)
			expect(result).toHaveLength(2)
		})
	})
	describe('fast check', () => {
		test('1', async () => {
			const m = 6
			const n = 11
			const k = 3
			const board = tf.tensor2d([
				[0, 0, 0, 0, 0, 0, 0, 0, 2, 1],
				[0, 0, 2, 0, 0, 0, 0, 0, 0, 0],
				[0, 0, 1, 0, 0, 1, 1, 2, 0, 0],
				[0, 0, 2, 0, 0, 0, 0, 0, 0, 0],
				[0, 0, 0, 0, 0, 1, 1, 2, 0, 0],
				[2, 0, 0, 0, 0, 0, 0, 2, 1, 1],
			])

			const result = checkWinnerConv2(board, m, n, k, 2, [1, 2])

			expect(result).toEqual(null)
		})

		test('2', async () => {
			const m = 13
			const n = 10
			const k = 3
			const board = tf.tensor2d([
				[0, 2, 0, 1, 2, 0, 0, 0, 1, 1],
				[2, 2, 2, 1, 0, 0, 1, 0, 0, 1],
				[0, 0, 1, 0, 2, 0, 0, 0, 0, 0],
				[2, 0, 0, 2, 0, 1, 0, 0, 2, 2],
				[1, 0, 0, 1, 1, 0, 1, 0, 0, 1],
				[0, 0, 0, 2, 0, 1, 0, 0, 0, 0],
				[2, 2, 2, 0, 0, 0, 0, 0, 0, 2],
				[0, 0, 1, 2, 0, 0, 2, 2, 1, 0],
				[2, 0, 1, 0, 0, 0, 0, 1, 1, 2],
				[0, 0, 2, 0, 0, 0, 1, 0, 2, 0],
				[0, 0, 0, 0, 2, 1, 0, 1, 0, 1],
				[0, 0, 0, 0, 0, 0, 0, 0, 0, 2],
				[0, 0, 1, 0, 1, 0, 1, 0, 2, 2],
			])

			const result = checkWinnerConv2(board, m, n, k, 2, [1, 2])

			expect(result).toEqual(
				expect.arrayContaining([
					[1, 2],
					[1, 0],
				]),
			)
			expect(result).toHaveLength(2)
		})

		test('3', () => {
			const m = 3
			const n = 7
			const k = 3
			const p = 1
			const board = tf.tensor2d([
				[1, 1, 0, 1, 2, 2, 0],
				[1, 2, 1, 2, 0, 0, 2],
				[1, 2, 1, 2, 1, 2, 2],
			])

			const result = checkWinnerConv2(board, m, n, k, p, [0, 0])

			expect(result).toEqual(
				expect.arrayContaining([
					[0, 0],
					[2, 0],
				]),
			)
			expect(result).toHaveLength(2)
		})
	})
	describe('no-win', () => {
		test('<k moves', async () => {
			const m = 3
			const n = 3
			const k = 3
			const board = tf.tensor2d([
				[0, 0, 0],
				[0, 0, 1],
				[0, 0, 0],
			])

			const result = checkWinnerConv2(board, m, n, k, 1, [1, 2])

			expect(result).toBe(null)
		})
	})
})

// describe('random m,n,k win conditions', () => {
// 	test.todo('random win scenarios', () => {
// 		for (let i = 0; i < 100; i++) {
// 			// Run 100 random tests
// 			const m = Math.floor(Math.random() * 10) + 3 // Random m between 3 and 12
// 			const n = Math.floor(Math.random() * 10) + 3 // Random n between 3 and 12
// 			const k = Math.floor(Math.random() * Math.min(m, n)) + 3 // Random k between 3 and min(m, n)

// 			const player = Math.random() < 0.5 ? 1 : 2 // Randomly choose player 1 or 2
// 			const board = generateRandomBoard(m, n)
// 			const winningLine = generateWinningLine(board, m, n, k, player)

// 			if (winningLine) {
// 				const { x, y } = winningLine.lastMove
// 				const result = checkWinnerConv2(tf.tensor2d(board), m, n, k, player, {
// 					x,
// 					y,
// 				})

// 				expect(result).toEqual({
// 					player: player,
// 					startRow: winningLine.startRow,
// 					startCol: winningLine.startCol,
// 					direction: winningLine.direction,
// 				})
// 			}
// 		}
// 	})
// })

describe('fast-check win', () => {
	test.todo('wmany m,n,k', () => {
		fc.assert(
			fc.property(
				fc
					.tuple(
						fc.integer({ min: 3, max: 12 }), // base for m
						fc.integer({ min: 0, max: 9 }), // offset for m
						fc.integer({ min: 3, max: 12 }), // base for n
						fc.integer({ min: 0, max: 9 }), // offset for n
						fc.integer({ min: 0, max: 9 }), // offset for k
						fc.constantFrom(1, 2), // player
					)
					.map(([mBase, mOffset, nBase, nOffset, kOffset, player]) => {
						const m = mBase + mOffset
						const n = nBase + nOffset
						const minDimension = Math.min(m, n)
						const k = Math.min(3 + kOffset, minDimension)
						return [m, n, k, player]
					}),
				([m, n, k, player]) => {
					const board = generateRandomBoard(m, n)
					console.log('params', m, n, k, player)
					console.log('board', board)
					const winningLine = generateWinningLine(board, m, n, k, player)

					console.log('winning', winningLine)

					if (winningLine) {
						const { x, y } = winningLine.lastMove
						const result = checkWinnerConv2(
							tf.tensor2d(board),
							m,
							n,
							k,
							player,
							{ x, y },
						)

						expect(result).toEqual({
							player: player,
							startRow: winningLine.startRow,
							startCol: winningLine.startCol,
							direction: winningLine.direction,
						})
					}

					return true // The test passes if we reach this point
				},
			),
			{ numRuns: 10 }, // Number of times to run the property
		)
	})
})

function generateRandomBoard(m: number, n: number): number[][] {
	const totalCells = m * n
	const filledCells = Math.floor(Math.random() * (totalCells - 1)) + 1
	const player1Cells = Math.ceil(filledCells / 2)

	const values = [
		...Array(player1Cells).fill(1),
		...Array(filledCells - player1Cells).fill(2),
		...Array(totalCells - filledCells).fill(0),
	]

	for (let i = values.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1))
		;[values[i], values[j]] = [values[j], values[i]]
	}

	return Array.from({ length: m }, (_, i) => values.slice(i * n, (i + 1) * n))
}

function generateWinningLine(
	board: number[][],
	m: number,
	n: number,
	k: number,
	player: number,
): {
	startRow: number
	startCol: number
	direction: string
	lastMove: { x: number; y: number }
} | null {
	const directions = [
		{ dx: 1, dy: 0, name: 'horizontal' },
		{ dx: 0, dy: 1, name: 'vertical' },
		{ dx: 1, dy: 1, name: 'diagonal' },
		{ dx: 1, dy: -1, name: 'anti-diagonal' },
	]

	for (let row = 0; row < m; row++) {
		for (let col = 0; col < n; col++) {
			for (const dir of directions) {
				if (checkLine(board, row, col, dir.dx, dir.dy, k, player)) {
					const lastMoveRow = row + (k - 1) * dir.dy
					const lastMoveCol = col + (k - 1) * dir.dx
					return {
						startRow: row,
						startCol: col,
						direction: dir.name,
						lastMove: { x: lastMoveCol, y: lastMoveRow },
					}
				}
			}
		}
	}
	return null
}

function checkLine(
	board: number[][],
	row: number,
	col: number,
	dx: number,
	dy: number,
	k: number,
	player: number,
): boolean {
	if (row + (k - 1) * dy >= board.length || row + (k - 1) * dy < 0) return false
	if (col + (k - 1) * dx >= board[0].length || col + (k - 1) * dx < 0)
		return false

	for (let i = 0; i < k; i++) {
		if (board[row + i * dy][col + i * dx] !== player) {
			return false
		}
	}
	return true
}
