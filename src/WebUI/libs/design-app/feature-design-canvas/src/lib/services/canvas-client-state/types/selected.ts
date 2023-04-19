import { ClientState } from './canvas-client-state'
import { TypeOfEntity } from '@design-app/feature-selected'

export type SelectedEntity = TypeOfEntity

export type SelectedState = ClientState<SelectedEntity> & {
  selectedStringId: string | undefined
  singleSelectedId: string | undefined
}

export const InitialSelectedState: SelectedState = {
  ids: [],
  entities: {},
  selectedStringId: undefined,
  singleSelectedId: undefined,
}