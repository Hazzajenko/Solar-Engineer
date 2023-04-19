import { TypeOfEntity } from '@design-app/feature-selected'

export type SelectedEntity = TypeOfEntity

export type SelectedState = {
  selectedStringId: string | undefined
  singleSelectedId: string | undefined
  multipleSelectedIds: string[]
}

export const InitialSelectedState: SelectedState = {
  // ids: [],
  // entities: {},
  selectedStringId: undefined,
  singleSelectedId: undefined,
  multipleSelectedIds: [],
}