import { TypeOfEntity } from '@design-app/feature-selected'

export type HoveringEntityState = {
  hoveringEntity: TypeOfEntity | undefined
  onMouseDownEntity: TypeOfEntity | undefined
}

export const InitialHoveringEntityState: HoveringEntityState = {
  hoveringEntity: undefined,
  onMouseDownEntity: undefined,
}