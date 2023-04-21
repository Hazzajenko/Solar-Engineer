import { CanvasEntity } from './canvas-entity'
import { PanelFactory } from './canvas-panel'
import { CanvasString } from './canvas-string'
import { UpdateStr } from '@ngrx/entity/src/models'

export const updateObject = <T>(object: T, changes: Partial<T>): T => {
  return {
    ...object,
    ...changes,
  }
}

export const updateObjectForStore = <T extends CanvasEntity>(
  object: T,
  changes: Partial<T>,
): UpdateStr<T> => {
  return {
    id: object.id,
    changes,
  }
}

export const updateObjectByIdForStore = <T extends CanvasEntity | CanvasString>(
  id: T['id'],
  changes: Partial<T>,
): UpdateStr<T> => {
  return {
    id: id,
    changes,
  }
}

export const Factory = {
  Panel: PanelFactory,
} as const