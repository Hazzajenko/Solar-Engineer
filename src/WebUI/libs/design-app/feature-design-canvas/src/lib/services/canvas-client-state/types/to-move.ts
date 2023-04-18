import { ClientState, ToRepositionEntity } from './canvas-client-state'
import { Point } from '@shared/data-access/models'

export type ToMoveState = ClientState<ToRepositionEntity> & {
  singleToMoveEntity: ToRepositionEntity | undefined
  multiToMoveStart: Point | undefined
}

export const InitialToMoveState: ToMoveState = {
  ids: [],
  entities: {},
  singleToMoveEntity: undefined,
  multiToMoveStart: undefined,
}