export const PANEL_SELECTED = {
  NOT_SELECTED: 'NotSelected',
  SINGLE_SELECTED: 'SingleSelected',
  MULTI_SELECTED: 'MultiSelected',
} as const

export type PanelSelected = (typeof PANEL_SELECTED)[keyof typeof PANEL_SELECTED]
