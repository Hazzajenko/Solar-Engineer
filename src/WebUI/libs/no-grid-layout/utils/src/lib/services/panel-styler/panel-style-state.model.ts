import { LineDirection } from '@no-grid-layout/shared'
import { LightColors, SoftColor, VibrantColor } from '@shared/data-access/models'

export type PanelStyleState = {
  id: string
  backgroundColor: PanelBackgroundColor
  direction?: LineDirection
  // borderColor: PanelBorderColor
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
// Default: SoftColor.SoftBrown,

export const PanelBorder = {
  Default: `1px solid black`,
  Selected: `2px solid black`,
  // Selected: `2px solid ${VibrantColor.VibrantRed}`,
  Hover: `1px solid ${VibrantColor.VibrantRed}`,
  LineThrough: `1px solid ${LightColors.LightRed}`,
  Nearby: `1px solid ${VibrantColor.VibrantPurple}`,
  /*  Nearby: VibrantColor.VibrantPurple,
   Red: VibrantColor.VibrantRed,*/
}

export type PanelBorderColor = (typeof PanelBorder)[keyof typeof PanelBorder]