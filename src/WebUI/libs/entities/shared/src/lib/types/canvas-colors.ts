export const CANVAS_COLORS = {
	SelectionBoxFillStyle: '#7585d8',
	CreationBoxFillStyle: '#ee80f9',
	DefaultPanelFillStyle: '#8ED6FF',
	HoveredPanelFillStyle: '#17fff3',
	SelectedPanelFillStyle: '#ff6e78',
	MultiSelectedPanelFillStyle: '#ff6ba1',
	StringSelectedPanelFillStyle: '#d323ff',
	PreviewPanelFillStyle: '#ff649b',
	TakenSpotFillStyle: '#ff0000',
	NearbyPanelFillStyle: '#13ff67',
	NearbyPanelStrokeStyle: '#1b5fff',
	RequestingLinkPanelFillStyle: '#d4342f',
	LinkingPanelFillStyle: '#ff6ba1',
	HoveringOverPanelInLinkMenuStrokeStyle: '#1b5fff',
	SpotTakenStrokeStyle: '#d4342f',
	UnselectedPanelFillStyle: '#a2a2a2',
} as const

export type CanvasColor = (typeof CANVAS_COLORS)[keyof typeof CANVAS_COLORS]

export const PANEL_STROKE_STYLE = {
	DEFAULT: '#000000' /*	DEFAULT: '#000000',
	 HOVERED: '#000000',
	 SINGLE_SELECTED: '#000000',
	 MULTI_SELECTED: '#000000',
	 STRING_SELECTED: '#000000',*/,
	SINGLE_SELECTED_STRING_SELECTED: '#00d0d4', // NEARBY: '#000000',
} as const

export type PanelStrokeStyle = (typeof PANEL_STROKE_STYLE)[keyof typeof PANEL_STROKE_STYLE]

/*export const CANVAS_COLORS_ARRAY = Object.values(CANVAS_COLORS) as string[]

 export const CANVAS_COLORS_KEYS = Object.keys(CANVAS_COLORS) as (keyof typeof CANVAS_COLORS)[]

 export const CANVAS_COLORS_VALUES = Object.values(CANVAS_COLORS) as string[]

 export const CANVAS_COLORS_ENTRIES = Object.entries(CANVAS_COLORS) as [keyof typeof CANVAS_COLORS, string][]

 export type CanvasColorKey = keyof typeof CANVAS_COLORS

 export type CanvasColorValue = typeof CANVAS_COLORS[CanvasColorKey]

 export type CanvasColorEntry = [CanvasColorKey, CanvasColorValue]*/
