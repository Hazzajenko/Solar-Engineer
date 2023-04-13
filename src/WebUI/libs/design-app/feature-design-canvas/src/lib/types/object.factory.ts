import { UpdateStr } from '@ngrx/entity/src/models'

export const updateObject = <T>(object: T, changes: Partial<T>): T => {
  return {
    ...object,
    ...changes,
  }
}

export const updateObjectForStore = <
  T extends {
    id: string
  },
>(
  object: T,
  changes: Partial<T>,
): UpdateStr<T> => {
  return {
    id: object.id,
    changes,
  }
}