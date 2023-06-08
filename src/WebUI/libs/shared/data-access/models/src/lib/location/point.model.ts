import { z } from 'zod'

export type Point = {
	x: number
	y: number
}

export const Point = z.object({
	x: z.number(),
	y: z.number(),
})
