// export const
import { ENTITY_TYPE, EntityType } from '@design-app/shared'

export const CANVAS_MODE = {
	SELECT: 'select',
	CREATE: 'create',
} as const

export type CanvasMode = (typeof CANVAS_MODE)[keyof typeof CANVAS_MODE]

export type ModeStateDeprecated = {
	mode: CanvasMode
	type: EntityType
}

export const InitialModeState: ModeStateDeprecated = {
	mode: CANVAS_MODE.SELECT,
	type: ENTITY_TYPE.Panel,
}