export type HoveringEntityState = {
  hoveringEntityId: string | undefined
  onMouseDownEntityId: string | undefined
}

export const InitialHoveringEntityState: HoveringEntityState = {
  hoveringEntityId: undefined,
  onMouseDownEntityId: undefined,
}
