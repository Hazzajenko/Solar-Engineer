import { TypeOfEntity } from '@design-app/feature-selected'

export type HoveringEntityState = {
  hoveringEntity: TypeOfEntity | undefined
}

export const InitialHoveringEntityState: HoveringEntityState = {
  hoveringEntity: undefined,
}