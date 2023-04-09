import { LightColors, VibrantColor } from '@shared/data-access/models'

export const StringColor = {
  Default: '#00B0FF',
  LineThrough: LightColors.LightRed,
  Nearby: VibrantColor.VibrantPurple,
  Selected: LightColors.LightBlue,
  Red: VibrantColor.VibrantRed,
  Green: VibrantColor.VibrantGreen,
  MultiSelected: VibrantColor.VibrantYellow,
  Orange: VibrantColor.VibrantOrange,
  Pink: LightColors.LightPink,
  LightGreen: LightColors.LightGreen,
  LightYellow: LightColors.LightYellow,
} as const

export type StringColor = (typeof StringColor)[keyof typeof StringColor]