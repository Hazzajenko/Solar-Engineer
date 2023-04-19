import { AngleRadians } from '../../../utils'
import { EntityType } from '@design-app/shared'
import { Point } from '@shared/data-access/models'

export type ToMoveState = {
  singleToMove: SingleToMove | undefined
  // multiToMoveStart: Point | undefined
  multiToMove: MultiToMove | undefined
}

export type SingleToMove = {
  id: string
  type: EntityType
  location: Point
  angle: AngleRadians
}

export type MultiToMove = {
  ids: string[]
  startPoint: Point
}
export const InitialToMoveState: ToMoveState = {
  // ids: [],
  // entities: {},
  singleToMove: undefined,
  multiToMove: undefined,
  // multiToMoveStart: undefined,
}