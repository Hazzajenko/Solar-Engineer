import { Point } from '@shared/data-access/models'

export function matrixMultiply(a: number[][], b: number[][]) {
	const numRowsA = a.length
	const numColsA = a[0].length
	const numRowsB = b.length
	const numColsB = b[0].length

	if (numColsA !== numRowsB) {
		throw new Error("matrix dimensions don't match")
	}

	const result: number[][] = []
	for (let i = 0; i < numRowsA; i++) {
		result[i] = []
		for (let j = 0; j < numColsB; j++) {
			let sum = 0
			for (let k = 0; k < numColsA; k++) {
				sum += a[i][k] * b[k][j]
			}
			result[i][j] = sum
		}
	}

	return result
}

export function matrixTransform(matrix: number[][], point: Point) {
	const result = matrixMultiply(matrix, [[point.x], [point.y], [1]])
	return { x: result[0][0], y: result[1][0] }
}