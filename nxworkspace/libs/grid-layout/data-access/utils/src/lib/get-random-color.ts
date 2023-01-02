import { SoftColor } from '@shared/data-access/models'

export function getRandomColor() {
  const number = Math.floor(Math.random() * (7 - 1) + 1)
  switch (number) {
    case 1:
      return SoftColor.SoftBrown
    case 2:
      return SoftColor.SoftOrange
    case 3:
      return SoftColor.SoftPink
    case 4:
      return SoftColor.SoftYellow
    case 5:
      return SoftColor.SoftRed
    case 6:
      return SoftColor.SoftCyan
    case 7:
      return SoftColor.SoftGreen
    default:
      return SoftColor.SoftBrown
  }
}

/*
export enum SoftColor {
  SoftBrown = '#E26D60',
  SoftOrange = '#E8A87C',
  SoftPink = '#FF77A9',
  SoftYellow = '#ffe78a',
  SoftRed = '#dd536a',
  SoftCyan = '#20dacb',
  SoftGreen = '#3bf5b1',
}*/
