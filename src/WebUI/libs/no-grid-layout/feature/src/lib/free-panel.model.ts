import { BackgroundColor } from './bg-color.builder'

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

/*export const BackgroundColorBuilderV = {
 bgBuilder: (color: BackgroundColor, opacity?: number) =>
 new BackgroundColorBuilder(color, opacity),
 }*/

/*
 export const BgColorBuilder = (
 color:
 | 'blue'
 | 'red'
 | 'green'
 | 'yellow'
 | 'orange'
 | 'indigo'
 | 'purple'
 | 'pink'
 | 'gray'
 | 'white',
 lightness?: 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900,
 ) => {
 const addOpacity = (opacity: number): BackgroundColorWithOpacity => {
 if (lightness) return `bg-${color}-${lightness} bg-opacity-${opacity}`
 return `bg-${color}-500 bg-opacity-${opacity}`
 }

 if (lightness)
 return {
 toString: (): BackgroundColorWithoutOpacity => `bg-${color}-${lightness}`,
 addOpacity,
 }
 return {
 toString: (): BackgroundColorWithoutOpacity => `bg-${color}-500`,
 addOpacity,
 }
 }
 export type BackgroundColor = BackgroundColorWithoutOpacity | BackgroundColorWithOpacity
 export type BackgroundColorWithoutOpacity = `bg-${string}-${number}`
 export type BackgroundColorWithOpacity = `${BackgroundColorWithoutOpacity} bg-opacity-${number}`*/

export interface FreePanelModel {
  id: string
  location: { x: number; y: number }
  border: string
  borderColorAndWidth: BorderColorAndWidth
  backgroundColor: BackgroundColor
}

/*export const FreePanelModel = {
 create: (id: string, location: { x: number; y: number }): FreePanelModel => ({
 id,
 location,
 border: BorderColorAndWidth.BlackThin,
 borderColorAndWidth: BorderColorAndWidth.BlackThin,
 backgroundColor: BgColorBuilder('blue', 500).toString(),
 }),

 update: (model: FreePanelModel, changes: Partial<FreePanelModel>): FreePanelModel => ({
 ...model,
 ...changes,
 }),

 serialize: (model: FreePanelModel): string => JSON.stringify(model),

 deserialize: (serialized: string): FreePanelModel => JSON.parse(serialized),

 // fromSerialized: (serialized: string): FreePanelModel => JSON.parse(serialized),
 }*/

/*
 const hello = () => {
 console.log('hello')
 const newPanel = FreePanelModel.create('1', { x: 0, y: 0 })
 console.log(newPanel)
 const updatedPanel = FreePanelModel.update(newPanel, { border: BorderColorAndWidth.BlackThick })
 }*/