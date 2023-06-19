// import { CanvasString, StringId, UndefinedStringId } from '@design-app/shared'
import { UpdateStr } from '@ngrx/entity/src/models'
import { getRandomVibrantColorHex, newGuid } from '@shared/utils'
import {
	ENTITY_TYPE,
	StringId,
	StringModel,
	UNDEFINED_STRING_ID,
	UNDEFINED_STRING_NAME,
} from '@entities/shared'

export const isStringId = (id: string): id is StringId => {
	return id === UNDEFINED_STRING_ID || id.startsWith('stringId')
}

export const isString = (string: StringModel | undefined): string is StringModel => {
	return string !== undefined && isStringId(string.id)
}

export const createString = (
	name = 'New String',
	color = getRandomVibrantColorHex(),
	parallel = false,
): StringModel => {
	return {
		id: newGuid() as StringId,
		name,
		colour: color,
		parallel,
		disconnectionPointId: undefined,
		type: ENTITY_TYPE.STRING,
	}
}

export const createUndefinedString = (): StringModel => {
	return {
		id: UNDEFINED_STRING_ID,
		name: UNDEFINED_STRING_NAME,
		colour: '#000000',
		parallel: false,
		disconnectionPointId: undefined,
		type: ENTITY_TYPE.STRING,
	}
}

export const CanvasStringFactory = {
	create: (name = 'New String', color = '#cf46ff', parallel = false): StringModel => {
		return {
			id: newGuid() as StringId,
			name,
			colour: color,
			parallel,
			disconnectionPointId: undefined,
			type: ENTITY_TYPE.STRING,
		}
	},
	update: (string: StringModel, changes: Partial<StringModel>): StringModel => {
		return {
			...string,
			...changes,
		}
	},
	updateForStore: (string: StringModel, changes: Partial<StringModel>): UpdateStr<StringModel> => {
		return {
			id: string.id,
			changes,
		}
	},
} as const

export const genStringName = (strings: StringModel[]): string => {
	const name = 'String'
	const count = strings.filter((s) => s.name === name).length
	return count > 0 ? `${name} ${count}` : name
}
