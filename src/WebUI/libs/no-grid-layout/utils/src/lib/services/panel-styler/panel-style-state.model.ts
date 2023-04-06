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
  Red: VibrantColor.VibrantRed,
  Green: VibrantColor.VibrantGreen,
  Yellow: VibrantColor.VibrantYellow,
  Orange: VibrantColor.VibrantOrange,
  Pink: LightColors.LightPink,
  Blue: LightColors.LightBlue,
  LightGreen: LightColors.LightGreen,
  LightYellow: LightColors.LightYellow,
} as const

export type PanelBackgroundColor = (typeof PanelBackgroundColor)[keyof typeof PanelBackgroundColor]

export const PanelBorderColor = {
  Default: SoftColor.SoftBrown,
  Nearby: VibrantColor.VibrantPurple,
  Red: VibrantColor.VibrantRed,
}

export type PanelBorderColor = (typeof PanelBorderColor)[keyof typeof PanelBorderColor]