import { EntityStoreService } from '@design-app/data-access'
import { CanvasPanel, updateObjectByIdForStore } from '@design-app/feature-design-canvas'
import { CanvasString, StringId, UndefinedStringId } from '@design-app/shared'
import { UpdateStr } from '@ngrx/entity/src/models'
import { newGuid } from '@shared/utils'


export const isStringId = (id: string): id is StringId => {
	return id === UndefinedStringId || id.startsWith('stringId')
}

export const isString = (string: CanvasString | undefined): string is CanvasString => {
	return string !== undefined && isStringId(string.id)
}

export const createString = (
	name: string = 'New String',
	color: string = '#cf46ff',
	parallel: boolean = false,
): CanvasString => {
	return {
		id: newGuid() as StringId,
		name,
		color,
		parallel,
	}
}

export const CanvasStringFactory = {
	create: (
		name: string = 'New String',
		color: string = '#cf46ff',
		parallel: boolean = false,
	): CanvasString => {
		return {
			id: newGuid() as StringId,
			name,
			color,
			parallel,
		}
	},
	update: (string: CanvasString, changes: Partial<CanvasString>): CanvasString => {
		return {
			...string,
			...changes,
		}
	},
	updateForStore: (
		string: CanvasString,
		changes: Partial<CanvasString>,
	): UpdateStr<CanvasString> => {
		return {
			id: string.id,
			changes,
		}
	},
} as const

export const genStringName = (strings: CanvasString[]): string => {
	const name = 'String'
	const count = strings.filter((s) => s.name === name).length
	return count > 0 ? `${name} ${count}` : name
}

export const genStringNameV2 = (strings: CanvasString[]): string => {
	const name = 'String'
	const count = strings.filter((s) => s.name === name).length
	return `${name}_${count}`
	// return count > 0 ? `${name} ${count}` : name
}

export const createStringWithPanels = (
	entities: EntityStoreService,
	selectedPanelIds: string[],
) => {
	const string = createString()

	const panels = entities.panels.getEntitiesByIds(selectedPanelIds)

	// const panels = entities.filter((entity) => entity.type === 'panel') as CanvasPanel[]
	const panelUpdates = panels.map((panel) =>
		updateObjectByIdForStore<CanvasPanel>(panel.id, { stringId: string.id }),
	)

	return { string, panelUpdates }
}