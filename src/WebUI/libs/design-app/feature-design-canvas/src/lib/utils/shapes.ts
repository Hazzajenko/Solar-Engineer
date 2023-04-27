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

// Calculate the distance from the center point to each corner
/*
 const distance = Math.sqrt(halfWidth ** 2 + halfHeight ** 2);

 // Calculate the four corners of the rectangle
 const corner1 = {
 x: centerX + distance * Math.cos(rotation - Math.atan2(halfHeight, halfWidth)),
 y: centerY + distance * Math.sin(rotation - Math.atan2(halfHeight, halfWidth))
 };
 const corner2 = {
 x: centerX + distance * Math.cos(rotation + Math.atan2(halfHeight, halfWidth)),
 y: centerY + distance * Math.sin(rotation + Math.atan2(halfHeight, halfWidth))
 };
 const corner3 = {
 x: centerX + distance * Math.cos(rotation - Math.atan2(-halfHeight, halfWidth)),
 y: centerY + distance * Math.sin(rotation - Math.atan2(-halfHeight, halfWidth))
 };
 const corner4 = {
 x: centerX + distance * Math.cos(rotation + Math.atan2(-halfHeight, halfWidth)),
 y: centerY + distance * Math.sin(rotation + Math.atan2(-halfHeight, halfWidth))
 };*/