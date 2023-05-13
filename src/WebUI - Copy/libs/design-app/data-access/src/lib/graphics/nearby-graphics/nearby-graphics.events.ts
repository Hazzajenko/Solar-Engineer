export type NearbyLinesToggle = {
	type: 'NearbyLinesToggle'
}

export type SelectCenterLineScreenSize = {
	type: 'SelectCenterLineScreenSize'
}

export type SelectTwoSideAxisLines = {
	type: 'SelectTwoSideAxisLines'
}

export type SelectCenterLineBetweenTwoEntities = {
	type: 'SelectCenterLineBetweenTwoEntities'
}

export const NEARBY_GRAPHICS_EVENT_TYPE = {
	SELECT_CENTER_LINE_SCREEN_SIZE: 'SelectCenterLineScreenSize',
	SELECT_TWO_SIDE_AXIS_LINES: 'SelectTwoSideAxisLines',
	SELECT_CENTER_LINE_BETWEEN_TWO_ENTITIES: 'SelectCenterLineBetweenTwoEntities',
} as const

export const NEARBY_GRAPHICS_EVENT = {
	NEARBY_LINES_TOGGLE: { type: 'NearbyLinesToggle' },
	SELECT_CENTER_LINE_SCREEN_SIZE: { type: 'SelectCenterLineScreenSize' },
	SELECT_TWO_SIDE_AXIS_LINES: { type: 'SelectTwoSideAxisLines' },
	SELECT_CENTER_LINE_BETWEEN_TWO_ENTITIES: { type: 'SelectCenterLineBetweenTwoEntities' },
} as const

export type NearbyGraphicsEventType =
	(typeof NEARBY_GRAPHICS_EVENT_TYPE)[keyof typeof NEARBY_GRAPHICS_EVENT_TYPE]

export type NearbyGraphicsEvent =
	| NearbyLinesToggle
	| SelectCenterLineScreenSize
	| SelectTwoSideAxisLines
	| SelectCenterLineBetweenTwoEntities

export const isNearbyLinesEnabled = (state: NearbyGraphicsState): boolean => {
	if (typeof state === 'string') return false
	return 'NearbyLinesEnabled' in state
}

/*export type NearbyGraphicsStateChildren =
 (typeof NEARBY_GRAPHICS_STATE.CHILDREN)[keyof typeof NEARBY_GRAPHICS_STATE.CHILDREN]*/

export type NearbyGraphicsState1 =
	(typeof NEARBY_GRAPHICS_STATE)[keyof typeof NEARBY_GRAPHICS_STATE]

export const NEARBY_GRAPHICS_STATE_MODE = {
	CENTER_LINE_BETWEEN_TWO_ENTITIES: 'CenterLineBetweenTwoEntities',
	CENTER_LINE_SCREEN_SIZE: 'CenterLineScreenSize',
	TWO_SIDE_AXIS_LINES: 'TwoSideAxisLines',
} as const

// CenterLineBetweenTwoEntities
// CenterLineScreenSize
// TwoSideAxisLines

export type NearbyGraphicsStateMode =
	(typeof NEARBY_GRAPHICS_STATE_MODE)[keyof typeof NEARBY_GRAPHICS_STATE_MODE]
export type NearbyGraphicsState =
	| {
			NearbyLinesEnabled: NearbyGraphicsStateMode
	  }
	| 'NearbyLinesDisabled'

export const NEARBY_LINES_STATE_KEY = 'NearbyLinesState'
export const NEARBY_GRAPHICS_STATE = {
	NEARBY_LINES_ENABLED: 'NearbyLinesEnabled',
	NEARBY_LINES_DISABLED: 'NearbyLinesDisabled', // CHILDREN: NEARBY_GRAPHICS_STATE_MODE,
} as const

/*export type NearbyGraphicsState2 =
 (typeof NEARBY_GRAPHICS_STATE)[keyof typeof NEARBY_GRAPHICS_STATE]

 type ValuesOf<T extends readonly any[]> = T[number]

 type NearbyGraphicsStateModeArray = [...NearbyGraphicsStateMode[]]
 const asdsa: NearbyGraphicsStateModeArray = [
 'CenterLineBetweenTwoEntities',
 'CenterLineScreenSize',
 'TwoSideAxisLines',
 ]
 type NearbyGraphicsStateMode2 = ValuesOf<NearbyGraphicsStateModeArray>

 const dsadsa: NearbyGraphicsStateMode2 = 'CenterLineBetweenTwoEntities'

 type ObjectUnionFromConst<T extends Record<string, any>> = {
 [K in keyof T]: { [P in K]: T[K] }
 }[keyof T]

 type UnionOrString<T> = T extends Record<string, any> ? ObjectUnionFromConst<T> : string

 type NearbyGraphicsState4 = UnionOrString<typeof NEARBY_GRAPHICS_STATE_MODE>

 const nnn: UnionOrString<typeof NEARBY_GRAPHICS_STATE.NEARBY_LINES_DISABLED> = 'ViewState'

 // export const NEARBY_GRAPHICS_STATE_MODE = {
 // 	CENTER_LINE_BETWEEN_TWO_ENTITIES: 'CenterLineBetweenTwoEntities',
 // 	CENTER_LINE_SCREEN_SIZE: 'CenterLineScreenSize',
 // 	TWO_SIDE_AXIS_LINES: 'TwoSideAxisLines',
 // } as const
 export const NEARBY_GRAPHICS_STATE_TEST = {
 NEARBY_LINES_ENABLED: 'NearbyLinesEnabled', // NEARBY_LINES_ENABLED: {},
 NEARBY_LINES_DISABLED: 'NearbyLinesDisabled',
 } as const

 type whatdasd = (typeof NEARBY_GRAPHICS_STATE_TEST)[keyof typeof NEARBY_GRAPHICS_STATE_TEST]
 const asdaa: whatdasd = 'NearbyLinesDisabled'
 /!*NEARBY_GRAPHICS_STATE_TEST['NEARBY_LINES_ENABLED'] = {
 CENTER_LINE_BETWEEN_TWO_ENTITIES: 'CenterLineBetweenTwoEntities',
 }*!/
 // (typeof NEARBY_GRAPHICS_STATE)[keyof typeof NEARBY_GRAPHICS_STATE]
 // NEARBY_GRAPHICS_STATE_MODE
 type ObjectToUnion533 =
 (typeof NEARBY_GRAPHICS_STATE_TEST)[keyof typeof NEARBY_GRAPHICS_STATE_TEST] extends {
 NearbyLinesEnabled: any
 }
 ? // type ObjectToUnion533 = typeof NEARBY_GRAPHICS_STATE_TEST extends { NearbyLinesEnabled: any }
 {
 NearbyLinesEnabled: (typeof NEARBY_GRAPHICS_STATE)[keyof typeof NEARBY_GRAPHICS_STATE]
 }
 : 'NearbyLinesDisabled'*/

// ? { NearbyLinesEnabled: ObjectToUnion<typeof NEARBY_GRAPHICS_STATE_TEST["NEARBY_LINES_ENABLED"]> }
/*const assadasddsa: ObjectToUnion533 = {
 NearbyLinesEnabled: 'CenterLineBetweenTwoEntities'
 }*/
// const asdsa: ObjectToUnion533 = "NearbyLinesDisabled"
// : "NearbyLinesDisabled";
/*type ObjectToUnion533<T> = T extends Record<string, any>
 ? T extends { NearbyLinesEnabled: any }
 ? { NearbyLinesEnabled: ObjectToUnion<T["NearbyLinesEnabled"]> }
 : never
 : "NearbyLinesDisabled";*/

/*export const NEARBY_GRAPHICS_STATE_TEST_ARRAY = [
 'NearbyLinesDisabled',
 {
 NearbyLinesEnabled: 'CenterLineBetweenTwoEntities',
 },
 {
 NearbyLinesEnabled: 'CenterLineScreenSize',
 },
 {
 NearbyLinesEnabled: 'TwoSideAxisLines',
 },
 ] as const

 // type NearbyGraphicsStateModeArray2 =

 type NearbyGraphicsStateModeArray222 = [...typeof NEARBY_GRAPHICS_STATE_TEST_ARRAY]
 /!*const asdasd: NearbyGraphicsStateModeArray222 = {
 '0': 'NearbyLinesDisabled',
 }*!/
 // type NearbyGraphicsStateModeArrayasdasdas = [...NEARBY_GRAPHICS_STATE_TEST_ARRAY[]]

 export type NearbyGraphicsStateModeTest =
 (typeof NEARBY_GRAPHICS_STATE_MODE)[keyof typeof NEARBY_GRAPHICS_STATE_MODE]

 type PossibleOptions =
 /!*	| 'NearbyLinesState.NearbyLinesDisabled'
 | 'NearbyLinesState.NearbyLinesEnabled'*!/
 | 'NearbyLinesState.NearbyLinesEnabled.CenterLineBetweenTwoEntities'
 | 'NearbyLinesState.NearbyLinesEnabled.CenterLineScreenSize'
 | 'NearbyLinesState.NearbyLinesEnabled.TwoSideAxisLines'

 type ObjectToUnion5332131 = PossibleOptions extends string
 ? // type ObjectToUnion533 = typeof NEARBY_GRAPHICS_STATE_TEST extends { NearbyLinesEnabled: any }
 {
 NearbyLinesEnabled: (typeof NEARBY_GRAPHICS_STATE)[keyof typeof NEARBY_GRAPHICS_STATE]
 }
 : 'NearbyLinesDisabled'
 type ObjectToUnion<T> = T extends Record<string, any>
 ? {
 [K in keyof T]: `${K}.${ObjectToUnion<T[K]>}`
 }[keyof T]
 : ''

 type PossibleOptions2 = ObjectToUnion<{
 NearbyLinesState: {
 NearbyLinesDisabled: string
 NearbyLinesEnabled: {
 CenterLineBetweenTwoEntities: string
 CenterLineScreenSize: string
 TwoSideAxisLines: string
 }
 }
 }>

 const PossibleOptions3: PossibleOptions2 =
 'NearbyLinesState.NearbyLinesEnabled.CenterLineBetweenTwoEntities.'

 type ObjectToUnion5<T> = T extends Record<string, any>
 ? T extends {
 NearbyLinesEnabled: any
 }
 ? {
 NearbyLinesEnabled: ObjectToUnion<T['NearbyLinesEnabled']>
 }
 : never
 : 'NearbyLinesDisabled'

 type PossibleOptions5 = ObjectToUnion5<{
 NearbyLinesState: {
 NearbyLinesDisabled: string
 NearbyLinesEnabled: {
 CenterLineBetweenTwoEntities: string
 CenterLineScreenSize: string
 TwoSideAxisLines: string
 }
 }
 }>*/

/*const PossibleOptions6: PossibleOptions5 = {
 'NearbyLinesEnabled': {

 }
 }*/
// | 'NearbyLinesState.NearbyLinesDisabled'
// | 'NearbyLinesState.NearbyLinesEnabled'
// | 'NearbyLinesState.NearbyLinesEnabled.CenterLineBetweenTwoEntities'
// | 'NearbyLinesState.NearbyLinesEnabled.CenterLineScreenSize'
// | 'NearbyLinesState.NearbyLinesEnabled.TwoSideAxisLines'

/*type ObjectOrString<T extends Record<string, string|object>> = {
 [K in keyof T]: { [P in K]: T[K] }
 }[keyof T]*/

// type ObjectOrString<T> = T extends Record<string, object> ? Record<string, any> : string
// const  www: ObjectOrString<any>
// type objectTest = Object.Merge<NearbyGraphicsState2, NearbyGraphicsStateMode>

/*
 const asdasdsa: NearbyGraphicsState4 = {
 NearbyLinesEnabled: 'CenterLineBetweenTwoEntities',
 }
 */

// NEARBY_GRAPHICS_STATE_MODE to array
// type NearbyGraphicsStateMode3 = ValuesOf<typeof NEARBY_GRAPHICS_STATE_MODE>;
