import { BackgroundColor, Lightness } from './bg-color.builder'

export const BgGen = {
  Blue: (lightness: Lightness = 500): BackgroundColor => `bg-blue-${lightness}`,
  Red: (lightness: Lightness = 500): BackgroundColor => `bg-red-${lightness}`,
  Green: (lightness: Lightness = 500): BackgroundColor => `bg-green-${lightness}`,
  Yellow: (lightness: Lightness = 500): BackgroundColor => `bg-yellow-${lightness}`,
  Orange: (lightness: Lightness = 500): BackgroundColor => `bg-orange-${lightness}`,
  Indigo: (lightness: Lightness = 500): BackgroundColor => `bg-indigo-${lightness}`,
  Purple: (lightness: Lightness = 500): BackgroundColor => `bg-purple-${lightness}`,
  Pink: (lightness: Lightness = 500): BackgroundColor => `bg-pink-${lightness}`,
  Gray: (lightness: Lightness = 500): BackgroundColor => `bg-gray-${lightness}`,
}

export const FreePanelBgStates = {
  Default: 'bg-pink-500',
  Hover: 'bg-pink-600',
  Active: 'bg-pink-700',
  Selected: 'bg-red-500',
  LineThrough: 'bg-blue-500',
} as const

export type FreePanelBgStates = (typeof FreePanelBgStates)[keyof typeof FreePanelBgStates]

// const active = FreePanelBgStates.Active