import { UpdateStr } from '@ngrx/entity/src/models'
import { newGuid } from '@shared/utils'

export type CanvasString = {
	id: StringId
	color: string
	name: string
	parallel: boolean
}

export type StringId = string & {
	readonly _type: 'stringId'
}

export const UndefinedStringId = 'undefinedStringId' as StringId

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
