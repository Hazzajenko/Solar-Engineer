const isNumber = (a: unknown): a is number => typeof a === 'number'

export type APoint = readonly [number, number]
export type ALine = readonly [APoint, APoint]

export type VLine = NVector
export type VPoint = NVector

export type Transform = NVector
export type VectorType = VLine | Transform | VPoint
type NVector = readonly [number, number, number, number, number, number, number, number]
export const distance = (line1: VLine, line2: VLine): number => inorm(meet(line1, line2))

export const angle = (line1: VLine, line2: VLine): number => Math.acos(dot(line1, line2)[0])

export const inorm = (a: VectorType): number =>
	Math.sqrt(Math.abs(a[7] * a[7] - a[5] * a[5] - a[4] * a[4] + a[1] * a[1]))

export const meet = <TVector extends VectorType>(a: TVector, b: TVector): NVector => [
	b[0] * a[0],
	b[1] * a[0] + b[0] * a[1],
	b[2] * a[0] + b[0] * a[2],
	b[3] * a[0] + b[0] * a[3],
	b[4] * a[0] + b[2] * a[1] - b[1] * a[2] + b[0] * a[4],
	b[5] * a[0] - b[3] * a[1] + b[1] * a[3] + b[0] * a[5],
	b[6] * a[0] + b[3] * a[2] - b[2] * a[3] + b[0] * a[6],
	b[7] * a[0] + b[6] * a[1] + b[5] * a[2] + b[4] * a[3] + b[3] * a[4] + b[2] * a[5] + b[1] * a[6],
]

export const dot = <TVector extends VectorType>(a: TVector, b: TVector): NVector => [
	b[0] * a[0] + b[2] * a[2] + b[3] * a[3] - b[6] * a[6],
	b[1] * a[0] +
		b[0] * a[1] -
		b[4] * a[2] +
		b[5] * a[3] +
		b[2] * a[4] -
		b[3] * a[5] -
		b[7] * a[6] -
		b[6] * a[7],
	b[2] * a[0] + b[0] * a[2] - b[6] * a[3] + b[3] * a[6],
	b[3] * a[0] + b[6] * a[2] + b[0] * a[3] - b[2] * a[6],
	b[4] * a[0] + b[7] * a[3] + b[0] * a[4] + b[3] * a[7],
	b[5] * a[0] + b[7] * a[2] + b[0] * a[5] + b[2] * a[7],
	b[6] * a[0] + b[0] * a[6],
	b[7] * a[0] + b[0] * a[7],
]

export const centerPoint = (a: APoint, b: APoint): APoint => {
	return [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2]
}

export const distance2d = (x1: number, y1: number, x2: number, y2: number) => {
	const xd = x2 - x1
	const yd = y2 - y1
	return Math.hypot(xd, yd)
}

export const distance2dPoint = (a: APoint, b: APoint) => {
	return distance2d(a[0], a[1], b[0], b[1])
}

export const rotation = (pivot: VPoint, angle: number): Transform =>
	add(mul(pivot, Math.sin(angle / 2)), Math.cos(angle / 2))

export const add = (a: NVector, b: NVector | number): NVector => {
	if (isNumber(b)) {
		return [a[0] + b, a[1], a[2], a[3], a[4], a[5], a[6], a[7]]
	}
	return [
		a[0] + b[0],
		a[1] + b[1],
		a[2] + b[2],
		a[3] + b[3],
		a[4] + b[4],
		a[5] + b[5],
		a[6] + b[6],
		a[7] + b[7],
	]
}

export const mul = (a: NVector, b: NVector | number): NVector => {
	if (isNumber(b)) {
		return [a[0] * b, a[1] * b, a[2] * b, a[3] * b, a[4] * b, a[5] * b, a[6] * b, a[7] * b]
	}
	return [
		mulScalar(a, b),
		b[1] * a[0] +
			b[0] * a[1] -
			b[4] * a[2] +
			b[5] * a[3] +
			b[2] * a[4] -
			b[3] * a[5] -
			b[7] * a[6] -
			b[6] * a[7],
		b[2] * a[0] + b[0] * a[2] - b[6] * a[3] + b[3] * a[6],
		b[3] * a[0] + b[6] * a[2] + b[0] * a[3] - b[2] * a[6],
		b[4] * a[0] +
			b[2] * a[1] -
			b[1] * a[2] +
			b[7] * a[3] +
			b[0] * a[4] +
			b[6] * a[5] -
			b[5] * a[6] +
			b[3] * a[7],
		b[5] * a[0] -
			b[3] * a[1] +
			b[7] * a[2] +
			b[1] * a[3] -
			b[6] * a[4] +
			b[0] * a[5] +
			b[4] * a[6] +
			b[2] * a[7],
		b[6] * a[0] + b[3] * a[2] - b[2] * a[3] + b[0] * a[6],
		b[7] * a[0] +
			b[6] * a[1] +
			b[5] * a[2] +
			b[4] * a[3] +
			b[3] * a[4] +
			b[2] * a[5] +
			b[1] * a[6] +
			b[0] * a[7],
	]
}

export const mulScalar = (a: NVector, b: NVector): number =>
	b[0] * a[0] + b[2] * a[2] + b[3] * a[3] - b[6] * a[6]

export const getSizeFromPoints = (points: readonly APoint[]) => {
	const xs = points.map((point) => point[0])
	const ys = points.map((point) => point[1])
	return {
		width: Math.max(...xs) - Math.min(...xs),
		height: Math.max(...ys) - Math.min(...ys),
	}
}
