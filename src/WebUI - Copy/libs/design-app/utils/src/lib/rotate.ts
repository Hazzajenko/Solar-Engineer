export const rotate = (
	x1: number,
	y1: number,
	x2: number,
	y2: number,
	angle: number,
): [number, number] => [
	(x1 - x2) * Math.cos(angle) - (y1 - y2) * Math.sin(angle) + x2,
	(x1 - x2) * Math.sin(angle) + (y1 - y2) * Math.cos(angle) + y2,
]
