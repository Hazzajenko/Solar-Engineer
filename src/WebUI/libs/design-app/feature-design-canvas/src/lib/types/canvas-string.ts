import { UpdateStr } from '@ngrx/entity/src/models'
import { newGuid } from '@shared/utils'

export type CanvasString = {
  id: string
  color: string
  name: string
  parallel: boolean
}

export const CanvasStringFactory = {
  create: (
    name: string = 'New String',
    color: string = '#cf46ff',
    parallel: boolean = false,
  ): CanvasString => {
    return {
      id: newGuid(),
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

export const GenStringName = (strings: CanvasString[]): string => {
  const name = 'String'
  const count = strings.filter((s) => s.name === name).length
  return count > 0 ? `${name} ${count}` : name
}