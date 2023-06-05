export const ENTITY_TYPE = {
	PANEL: 'Panel',
	STRING: 'String',
	PANEL_CONFIG: 'PanelConfig',
} as const

export type EntityType = (typeof ENTITY_TYPE)[keyof typeof ENTITY_TYPE]

export function isEntityType(value: string): value is EntityType {
	return Object.values(ENTITY_TYPE).includes(value as EntityType)
}
