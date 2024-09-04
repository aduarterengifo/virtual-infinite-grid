import * as tf from '@tensorflow/tfjs'

export const nthArrayInStack = (t: tf.Tensor3D, n: number) =>
	t.slice([n, 0, 0], [1, -1, -1]).squeeze([0]) as tf.Tensor2D

type Tensor2D = tf.Tensor2D
type Tensor1D = tf.Tensor1D

// applicators
export const applyToRows = (
	tensor: tf.Tensor2D,
	fn: (row: tf.Tensor1D) => tf.Tensor1D,
) => {
	return tf.tidy(() => {
		const rows = tf.unstack(tensor)
		const appliedRows = rows.map((row) => fn(row as tf.Tensor1D))
		return tf.stack(appliedRows) as tf.Tensor2D
	})
}

export const applyToColumns = (
	tensor: tf.Tensor2D,
	fn: (column: tf.Tensor1D) => tf.Tensor1D,
) => {
	return tf.tidy(() => {
		const columns = tf.unstack(tensor.transpose())
		const appliedColumns = columns.map((column) => fn(column as tf.Tensor1D))
		return tf.stack(appliedColumns).transpose() as tf.Tensor2D
	})
}

// 1d functions
export const nConsecutiveCollapse = (
	tensor: tf.Tensor1D,
	n: number,
	value?: number,
): boolean => {
	return tf.tidy(() => {
		const data = tensor.dataSync()
		let count = 0
		for (let i = 0; i < data.length; i++) {
			if (value === undefined || data[i] === value) {
				count++
				if (count === n) return true
			} else {
				count = 0
			}
		}
		return false
	})
}

export const nConsecutive = (
	tensor: tf.Tensor1D,
	n: number,
	value?: number,
): tf.Tensor1D => {
	return tf.tidy(() => {
		const data = tensor.dataSync()
		let count = 0
		const result = new Array(data.length).fill(0)
		for (let i = 0; i < data.length; i++) {
			if (value === undefined || data[i] === value) {
				count++
				if (count >= n) {
					for (let j = i - n + 1; j <= i; j++) {
						result[j] = 1
					}
				}
			} else {
				count = 0
			}
		}
		return tf.tensor1d(result)
	})
}

export const matrixSubset = (
	tensor: Tensor2D,
	startRow: number,
	startCol: number,
	numRows?: number,
	numCols?: number,
): Tensor2D =>
	tensor.slice(
		[startRow, startCol],
		[
			numRows ?? tensor.shape[0] - startRow,
			numCols ?? tensor.shape[1] - startCol,
		],
	)

export const rowSubset = (
	tensor: Tensor2D,
	rowIndex: number,
	start = 0,
	length?: number,
): Tensor1D => tensor.slice([rowIndex, start], [1, length ?? -1]).squeeze([0])

export const columnSubset = (
	tensor: Tensor2D,
	columnIndex: number,
	start = 0,
	length?: number,
): Tensor1D =>
	tensor.slice([start, columnIndex], [length ?? -1, 1]).squeeze([1])

export const mainDiagonalSubset = (
	tensor: Tensor2D,
	start = 0,
	length?: number,
): Tensor1D => {
	const [numRows, numCols] = tensor.shape
	const maxLength = Math.min(numRows, numCols) - start
	const actualLength = Math.min(length ?? maxLength, maxLength)
	const indices = tf.range(start, start + actualLength)
	return tf.stack([indices, indices], 1).gather(tensor).flatten()
}

export const antiDiagonalSubset = (
	tensor: Tensor2D,
	start = 0,
	length?: number,
): Tensor1D => {
	const [numRows, numCols] = tensor.shape
	const maxLength = Math.min(numRows, numCols) - start
	const actualLength = Math.min(length ?? maxLength, maxLength)
	const rowIndices = tf.range(start, start + actualLength)
	const colIndices = tf.range(
		numCols - 1 - start,
		numCols - 1 - start - actualLength,
		-1,
	)
	return tf.stack([rowIndices, colIndices], 1).gather(tensor).flatten()
}

export const tensor2DElement = (tensor: tf.Tensor2D, x: number, y: number) =>
	tensor.slice([x, y], [1, 1]).dataSync()[0]

export const setValueAtCoordinates = (
	tensor: tf.Tensor2D,
	x: number,
	y: number,
	value: number,
) => {
	return tf.tidy(() => {
		const arrayData = tensor.arraySync()
		arrayData[x][y] = value
		return tf.tensor2d(arrayData)
	})
}