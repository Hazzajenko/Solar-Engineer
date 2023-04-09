import { LineDirection } from '@design-app/canvas'
import { LightColors, SoftColor, VibrantColor } from '@shared/data-access/models'

export type PanelStyleState = {
  id: string
  backgroundColor: PanelBackgroundColor
  direction?: LineDirection
}

export const PanelBackgroundColor = {
  Default: SoftColor.SoftBrown,
  LineThrough: LightColors.LightRed,
  Nearby: VibrantColor.VibrantPurple,
  Selected: LightColors.LightBlue,
  Hover: '#ED5565',
  Red: VibrantColor.VibrantRed,
  Green: VibrantColor.VibrantGreen,
  MultiSelected: VibrantColor.VibrantYellow,
  Orange: VibrantColor.VibrantOrange,
  Pink: LightColors.LightPink,
  LightGreen: LightColors.LightGreen,
  LightYellow: LightColors.LightYellow,
} as const

export type PanelBackgroundColor = (typeof PanelBackgroundColor)[keyof typeof PanelBackgroundColor]

export const PanelBorder = {
  Default: `1px solid black`,
  Selected: `2px solid black`,
  Hover: `1px solid ${VibrantColor.VibrantRed}`,
  LineThrough: `1px solid ${LightColors.LightRed}`,
  Nearby: `1px solid ${VibrantColor.VibrantPurple}`,
} as const

export type PanelBorderColor = (typeof PanelBorder)[keyof typeof PanelBorder]