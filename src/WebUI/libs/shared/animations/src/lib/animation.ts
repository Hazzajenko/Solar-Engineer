import { z } from 'zod'

export type AnimationEvent = {
	disabled: boolean
	element: HTMLElement
	fromState: string | null
	phaseName: string
	toState: string
	totalTime: number
	triggerName: string
	_data: number
}

// {
// 	"code": "invalid_type",
// 	"expected": "array",
// 	"received": "object",
// 	"path": [
// 	"element",
// 	"attributes"
// ],
// 	"message": "Expected array, received object"
// },
// {
// 	"code": "invalid_type",
// 	"expected": "string",
// 	"received": "null",
// 	"path": [
// 	"toState"
// ],
// 	"message": "Expected string, received null"
// }

export const ANIMATION_EVENT = z.object({
	disabled: z.boolean(), // element: z.object({
	// 	attributes: z.object({
	// 		name: z.string(),
	// 		value: z.string(),
	// 	}),
	// 	classList: z.object({
	// 		length: z.number(),
	// 		value: z.string(),
	// 	}),
	// }),
	fromState: z.string().nullable(),
	phaseName: z.string(),
	toState: z.string().nullable(),
	totalTime: z.number(),
	triggerName: z.string(),
	_data: z.number(),
})
