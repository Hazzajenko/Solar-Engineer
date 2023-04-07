/*export const PanelColorState = {
 Default: 'bg-pink-500',
 Hover: 'bg-pink-600',
 Active: 'bg-pink-700',
 Selected: 'bg-indigo-500',
 MultiSelected: 'bg-green-500',
 // Selected: 'bg-red-500',
 LineThrough: 'bg-blue-500',
 } as const

 export type PanelColorState = (typeof PanelColorState)[keyof typeof PanelColorState]*/

export const PanelRotation = {
  Default: 'portrait',
  Portrait: 'portrait',
  Landscape: 'landscape',
} as const

export type PanelRotation = (typeof PanelRotation)[keyof typeof PanelRotation]
