import { AngleRadians } from '../../../utils'
import { EntityType } from '@design-app/shared'
import { Point } from '@shared/data-access/models'

export type ToMoveState = {
  singleToMove: SingleToMove | undefined
  // multiToMoveStart: Point | undefined
  multipleToMove: MultiToMove | undefined
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
  offset: Point
  entities: MultiToMoveEntity[]
}

export type MultiToMoveEntity = {
  id: string
  type: EntityType
  location: Point
  angle: AngleRadians
}
export const InitialToMoveState: ToMoveState = {
  // ids: [],
  // entities: {},
  singleToMove: undefined,
  multipleToMove: undefined,
  // multiToMoveStart: undefined,
}