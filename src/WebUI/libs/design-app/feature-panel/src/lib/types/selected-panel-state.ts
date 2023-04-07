export const SelectedPanelState = {
  SingleSelected: 'SingleSelected',
  MultiSelected: 'MultiSelected',
  NoneSelected: 'NoneSelected',
} as const

export type SelectedPanelState = (typeof SelectedPanelState)[keyof typeof SelectedPanelState]
