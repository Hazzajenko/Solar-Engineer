// import { CanvasString, StringId, UndefinedStringId } from '@design-app/shared'
import { UpdateStr } from '@ngrx/entity/src/models'
import { getRandomVibrantColorHex, newGuid } from '@shared/utils'
import { CanvasString, StringId, UndefinedStringId } from '../types'

export const isStringId = (id: string): id is StringId => {
	return id === UndefinedStringId || id.startsWith('stringId')
}

export const isString = (string: CanvasString | undefined): string is CanvasString => {
	return string !== undefined && isStringId(string.id)
}

export const createString = (
	name = 'New String',
	color = getRandomVibrantColorHex(), // color = '#cf46ff',
	// color = getRandomColourBasic(), // color = '#cf46ff',
	parallel = false,
): CanvasString => {
	return {
		id: newGuid() as StringId,
		name,
		color,
		parallel,
	}
}

export const CanvasStringFactory = {
	create: (name = 'New String', color = '#cf46ff', parallel = false): CanvasString => {
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
