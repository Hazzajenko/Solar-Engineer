import { AngleRadians } from '../../../utils'
import { ClientState, ToRepositionEntity } from './canvas-client-state'
import { EntityType } from '@design-app/shared'
import { Point } from '@shared/data-access/models'

export type ToMoveState = ClientState<ToRepositionEntity> & {
  singleToMove: SingleToMove | undefined
  multiToMoveStart: Point | undefined
}

export type SingleToMove = {
  id: string
  type: EntityType
  location: Point
  angle: AngleRadians
}

export const InitialToMoveState: ToMoveState = {
  ids: [],
  entities: {},
  singleToMove: undefined,
  multiToMoveStart: undefined,
}