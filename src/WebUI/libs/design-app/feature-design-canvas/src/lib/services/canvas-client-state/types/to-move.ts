import { AngleRadians } from '../../../utils'
import { EntityType } from '@design-app/shared'
import { Point } from '@shared/data-access/models'

export type ToMoveState = {
  singleToMove: SingleToMove | undefined
  // multiToMoveStart: Point | undefined
  multipleToMove: MultipleToMove | undefined
}

export type SingleToMove = {
  id: string
  type: EntityType
  location: Point
  angle: AngleRadians
}

export type MultipleToMove = {
  ids: string[]
  startPoint: Point
  offset: Point
  entities: MultipleToMoveEntity[]
}

export type MultipleToMoveEntity = {
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