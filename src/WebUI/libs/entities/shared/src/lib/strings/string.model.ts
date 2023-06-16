import { PanelId, PanelModel } from '../panels'
import { BackendDataModel } from '../backend-data/backend-data.model'
import { ENTITY_TYPE } from '../common'

export type StringBackendModel = StringModel & BackendDataModel

export type StringModel = {
	id: StringId
	colour: string
	name: string
	parallel: boolean
	disconnectionPointId: PanelId | undefined
	type: typeof ENTITY_TYPE.STRING
}

export type StringId = string & {
	readonly _type: 'stringId'
}

export type StringWithPanels = {
	string: StringModel
	panels: PanelModel[]
}

export const UNDEFINED_STRING_ID = 'UNDEFINED_STRING_ID' as StringId
export const UNDEFINED_STRING_NAME = 'UNDEFINED_STRING' as StringModel['name']

// export const isStringId = (id: string): id is StringId => {
// 	return id === UndefinedStringId || id.startsWith('stringId')
// }
//
// export const isString = (string: CanvasString | undefined): string is CanvasString => {
// 	return string !== undefined && isStringId(string.id)
// }
//
// export const createString = (
// 	name: string = 'New String',
// 	color: string = '#cf46ff',
// 	parallel: boolean = false,
// ): CanvasString => {
// 	return {
// 		id: newGuid() as StringId,
// 		name,
// 		color,
// 		parallel,
// 	}
// }
//
// export const CanvasStringFactory = {
// 	create: (
// 		name: string = 'New String',
// 		color: string = '#cf46ff',
// 		parallel: boolean = false,
// 	): CanvasString => {
// 		return {
// 			id: newGuid() as StringId,
// 			name,
// 			color,
// 			parallel,
// 		}
// 	},
// 	update: (string: CanvasString, changes: Partial<CanvasString>): CanvasString => {
// 		return {
// 			...string,
// 			...changes,
// 		}
// 	},
// 	updateForStore: (
// 		string: CanvasString,
// 		changes: Partial<CanvasString>,
// 	): UpdateStr<CanvasString> => {
// 		return {
// 			id: string.id,
// 			changes,
// 		}
// 	},
// } as const
//
// export const genStringName = (strings: CanvasString[]): string => {
// 	const name = 'String'
// 	const count = strings.filter((s) => s.name === name).length
// 	return count > 0 ? `${name} ${count}` : name
// }
//
// export const genStringNameV2 = (strings: CanvasString[]): string => {
// 	const name = 'String'
// 	const count = strings.filter((s) => s.name === name).length
// 	return `${name}_${count}`
// 	// return count > 0 ? `${name} ${count}` : name
// }
