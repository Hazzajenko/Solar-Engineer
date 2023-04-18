import { ClientState } from './canvas-client-state'
import { TypeOfEntity } from '@design-app/feature-selected'

export type SelectedEntity = TypeOfEntity

export type SelectedState = ClientState<SelectedEntity> & {
  selectedStringId: string | undefined
  singleSelected: TypeOfEntity | undefined
}

export const InitialSelectedState: SelectedState = {
  ids: [],
  entities: {},
  selectedStringId: undefined,
  singleSelected: undefined,
}