export const tupleToCoors = (
	xyTuple: readonly [number, number],
): {
	x: number
	y: number
} => {
	const [x, y] = xyTuple
	return { x, y }
}
