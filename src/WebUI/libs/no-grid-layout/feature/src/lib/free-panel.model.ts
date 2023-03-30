export const BorderColor = {
  black: 'border border-black',
  blue: 'border border-blue-500',
  red: 'border border-red-500',
  green: 'border border-green-500',
  yellow: 'border border-yellow-500',
  indigo: 'border border-indigo-500',
  purple: 'border border-purple-500',
  pink: 'border border-pink-500',
  gray: 'border border-gray-500',
  white: 'border border-white',
} as const

export type BorderColor = (typeof BorderColor)[keyof typeof BorderColor]

export const BorderWidth = {
  thin: 'border-2',
  thick: 'border-2',
} as const

export type BorderWidth = (typeof BorderWidth)[keyof typeof BorderWidth]

export const BorderStyle = {
  solid: 'border-solid',
  dashed: 'border-dashed',
  dotted: 'border-dotted',
  double: 'border-double',
  none: 'border-none',
} as const

export type BorderStyle = (typeof BorderStyle)[keyof typeof BorderStyle]

export const BorderColorAndWidth = {
  BlackThin: 'border border-black',
  BlackThick: 'border border-black border-2',
  BlueThin: 'border border-blue-500',
  BlueThick: 'border border-blue-500 border-2',
  RedThin: 'border border-red-500',
  RedThick: 'border border-red-500 border-2',
  GreenThin: 'border border-green-500',
  GreenThick: 'border border-green-500 border-2',
  YellowThin: 'border border-yellow-500',
  YellowThick: 'border border-yellow-500 border-2',
  IndigoThin: 'border border-indigo-500',
  IndigoThick: 'border border-indigo-500 border-2',
  PurpleThin: 'border border-purple-500',
  PurpleThick: 'border border-purple-500 border-2',
  PinkThin: 'border border-pink-500',
  PinkThick: 'border border-pink-500 border-2',
  GrayThin: 'border border-gray-500',
  GrayThick: 'border border-gray-500 border-2',
  WhiteThin: 'border border-white',
  WhiteThick: 'border border-white border-2',
} as const

export type BorderColorAndWidth = (typeof BorderColorAndWidth)[keyof typeof BorderColorAndWidth]

export const BackgroundColor = {
  Black: 'bg-black',
  Blue: 'bg-blue-500',
  Red: 'bg-red-500',
  Green: 'bg-green-500',
  Yellow: 'bg-yellow-500',
  Indigo: 'bg-indigo-500',
  Purple: 'bg-purple-500',
  Pink: 'bg-pink-500',
  Gray: 'bg-gray-500',
  White: 'bg-white',
} as const

export type BackgroundColor = (typeof BackgroundColor)[keyof typeof BackgroundColor]

type StringThatStartsWithGet = `get${string}`

type BackGroundColorYo = `bg-${string}-${number}`

/*export const BackgroundColorAndOpacity = {
 Black10: 'bg-black bg-opacity-10',
 Black20: 'bg-black bg-opacity-20',
 Black30: 'bg-black bg-opacity-30',
 Black40: 'bg-black bg-opacity-40',
 Black50: 'bg-black bg-opacity-50',
 Black60: 'bg-black bg-opacity-60',

 }*/

/*export const BackgroundColorBuilder = {
 Black: (opacity: number) => `bg-black bg-opacity-${opacity}`,
 Blue: (opacity: number) => `bg-blue-500 bg-opacity-${opacity}`,
 Red: (opacity: number) => `bg-red-500 bg-opacity-${opacity}`,
 Green: (opacity: number) => `bg-green-500 bg-opacity-${opacity}`,
 Yellow: (opacity: number) => `bg-yellow-500 bg-opacity-${opacity}`,
 Indigo: (opacity: number) => `bg-indigo-500 bg-opacity-${opacity}`,
 Purple: (opacity: number) => `bg-purple-500 bg-opacity-${opacity}`,
 Pink: (opacity: number) => `bg-pink-500 bg-opacity-${opacity}`,
 Gray: (opacity: number) => `bg-gray-500 bg-opacity-${opacity}`,
 White: (opacity: number) => `bg-white bg-opacity-${opacity}`,
 } as const

 export type BackgroundColorBuilder =
 (typeof BackgroundColorBuilder)[keyof typeof BackgroundColorBuilder]*/

/*export const BackgroundColorBuilderV2 = {
 /!*  Blue: (opacity: number) => {
 return {
 backgroundColor: 'bg-blue-500',
 opacity: `bg-opacity-${opacity}`,
 }
 }*!/
 AddBackgroundColor: (color: BackgroundColor) => {
 return {
 color,
 AddOpacity: (opacity: number) => {
 return `${color}bg-opacity-${opacity}`
 },
 }
 },

 AddOpacity: (opacity: number) => {
 return {
 opacity: `bg-opacity-${opacity}`,
 }
 },
 } as const

 export type BackgroundColorBuilderV2 =
 (typeof BackgroundColorBuilderV2)[keyof typeof BackgroundColorBuilderV2]
 const test = BackgroundColorBuilderV2.AddBackgroundColor('bg-blue-500').AddOpacity(10)
 const test2 = BackgroundColorBuilderV2.AddBackgroundColor('bg-blue-500')*/

export class BackgroundColorBuilder {
  private readonly color: BackgroundColor
  private opacity: number | null = null

  constructor(color: BackgroundColor, opacity?: number) {
    this.color = color
    if (opacity) this.opacity = opacity
  }

  AddOpacity(opacity: number): BackgroundColorBuilder {
    this.opacity = opacity
    return this
  }

  toString(): string {
    if (!this.opacity) return this.color
    return `${this.color} bg-opacity-${this.opacity}`
  }
}

export const BackgroundColorBuilderV = {
  bgBuilder: (color: BackgroundColor, opacity?: number) =>
    new BackgroundColorBuilder(color, opacity),
}

export type BackgroundColorBuilderV =
  (typeof BackgroundColorBuilderV)[keyof typeof BackgroundColorBuilderV]
const hello66 = BackgroundColorBuilderV.bgBuilder('bg-blue-500', 10).toString()
const bgBlueBuilder = {
  AddLightness: (lightness: 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900) =>
    `bg-blue-${lightness}`,
}

export const ColorSelector = (
  color: 'blue' | 'red' | 'green' | 'yellow' | 'indigo' | 'purple' | 'pink' | 'gray' | 'white',
  lightness?: 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900,
) => {
  const addOpacity = (opacity: number) => {
    if (lightness) return `bg-${color}-${lightness} bg-opacity-${opacity}`
    return `bg-${color}-500 bg-opacity-${opacity}`
  }

  if (lightness)
    return {
      toString: () => `bg-${color}-${lightness}`,
      addOpacity,
    }
  return {
    toString: () => `bg-${color}-500`,
    addOpacity,
  }
}

// BackGroundColorYo

const hello222 = ColorSelector('green', 500)
hello222.toString()

const hiiii = new BackgroundColorBuilder('bg-blue-500', 10).toString()

export const BackgroundColorBuilderV3 = {
  AddBackgroundColor: (color: BackgroundColor) => {
    return {
      color,
      AddOpacity: (opacity: number) => {
        return new BackgroundColorBuilder(color, opacity)
      },
    }
  },
} as const

export type BackgroundColorBuilderV3 =
  (typeof BackgroundColorBuilderV3)[keyof typeof BackgroundColorBuilderV3]
const hello2 = BackgroundColorBuilderV3.AddBackgroundColor('bg-blue-500').AddOpacity(10).toString()
const hello3 = new BackgroundColorBuilder('bg-blue-500', 10).toString()

// export type BlockType = (typeof BLOCK_TYPE)[keyof typeof BLOCK_TYPE]
export interface FreePanelModel {
  id: string
  /*  x: number
   y: number*/
  location: { x: number; y: number }
  border: string
  borderColorAndWidth: BorderColorAndWidth
}

export const FreePanelModel = {
  create: (id: string, location: { x: number; y: number }): FreePanelModel => ({
    id,
    location,
    border: BorderColorAndWidth.BlackThin,
    borderColorAndWidth: BorderColorAndWidth.BlackThin,
  }),

  update: (model: FreePanelModel, changes: Partial<FreePanelModel>): FreePanelModel => ({
    ...model,
    ...changes,
  }),

  serialize: (model: FreePanelModel): string => JSON.stringify(model),

  deserialize: (serialized: string): FreePanelModel => JSON.parse(serialized),

  // fromSerialized: (serialized: string): FreePanelModel => JSON.parse(serialized),
}

const hello = () => {
  console.log('hello')
  const newPanel = FreePanelModel.create('1', { x: 0, y: 0 })
  console.log(newPanel)
  const updatedPanel = FreePanelModel.update(newPanel, { border: BorderColorAndWidth.BlackThick })
}
