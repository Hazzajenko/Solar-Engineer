import { rotate } from './rotate'

export const getCornersOfRectWhenRotated = (
	x: number,
	y: number,
	width: number,
	height: number,
	angle: number,
) => {
	const centerX = x + width / 2
	const centerY = y + height / 2
	return [
		rotate(x, y, centerX, centerY, angle),
		rotate(x + width, y, centerX, centerY, angle),
		rotate(x + width, y + height, centerX, centerY, angle),
		rotate(x, y + height, centerX, centerY, angle),
	]
}