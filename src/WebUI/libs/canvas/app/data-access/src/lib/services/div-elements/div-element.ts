import { createDefaultArrayFromConst } from '@shared/utils'

export const DIV_ELEMENT = {
	FPS: 'fps',
	SCALE_ELEMENT: 'scale-element' /*	MOUSE_POS: 'mouse-pos',
	 TRANSFORMED_MOUSE_POS: 'transformed-mouse-pos',
	 STRING_STATS: 'string-stats',
	 PANEL_STATS: 'panel-stats',
	 ROTATE_STATS: 'rotate-stats',*/,
} as const

export type DivElement = (typeof DIV_ELEMENT)[keyof typeof DIV_ELEMENT]

export const InitialDivElements = createDefaultArrayFromConst(DIV_ELEMENT) as Array<DivElement>
