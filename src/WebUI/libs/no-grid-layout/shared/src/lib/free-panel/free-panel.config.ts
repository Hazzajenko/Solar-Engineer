export const PanelColorState = {
  Default: 'bg-pink-500',
  Hover: 'bg-pink-600',
  Active: 'bg-pink-700',
  Selected: 'bg-indigo-500',
  // Selected: 'bg-red-500',
  LineThrough: 'bg-blue-500',
} as const

export type PanelColorState = (typeof PanelColorState)[keyof typeof PanelColorState]

export const PanelRotationConfig = {
  Default: 'portrait',
  Portrait: 'portrait',
  Landscape: 'landscape',
} as const

export type PanelRotationConfig = (typeof PanelRotationConfig)[keyof typeof PanelRotationConfig]
