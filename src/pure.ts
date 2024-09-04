export type Coordinate2D = [number, number]

export const flatArrayIndexTo2DMatrixCoordinates = (
	index: number,
	stride: number,
) => ({
	x: Math.floor(index / stride),
	y: index % stride,
})

export const flatArrayIndexToCoordinate2D = (
	index: number,
	stride: number,
): Coordinate2D => [Math.floor(index / stride), index % stride]