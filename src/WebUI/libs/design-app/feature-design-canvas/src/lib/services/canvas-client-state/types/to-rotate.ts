import { ClientState, ToRepositionEntity } from '@design-app/feature-design-canvas'

export type ToRotateState = ClientState<ToRepositionEntity> & {
  singleToRotateEntity: ToRepositionEntity | undefined
}

export const InitialToRotateState: ToRotateState = {
  ids: [],
  entities: {},
  singleToRotateEntity: undefined,
}