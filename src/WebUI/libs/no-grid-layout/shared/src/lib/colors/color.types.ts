export type Lightness = 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900
export const TailBgColor = {
  Blue: 'bg-blue-500',
  Red: 'bg-red-500',
  Green: 'bg-green-500',
  Yellow: 'bg-yellow-500',
  Orange: 'bg-orange-500',
  Indigo: 'bg-indigo-500',
  Purple: 'bg-purple-500',
  Pink: 'bg-pink-500',
  Gray: 'bg-gray-500',
  White: 'bg-white',
}

export type BackgroundColor = BackgroundColorWithoutOpacity | BackgroundColorWithOpacity
export type BackgroundColorWithoutOpacity = `bg-${string}-${number}`
export type BackgroundColorWithOpacity = `${BackgroundColorWithoutOpacity} bg-opacity-${number}`

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
export const Color = {
  Blue: 'blue',
  Red: 'red',
  Green: 'green',
  Yellow: 'yellow',
  Orange: 'orange',
  Indigo: 'indigo',
  Purple: 'purple',
  Pink: 'pink',
  Gray: 'gray',
  White: 'white',
} as const

export type Color = (typeof Color)[keyof typeof Color]
