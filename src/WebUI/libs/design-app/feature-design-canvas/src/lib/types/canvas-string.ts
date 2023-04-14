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