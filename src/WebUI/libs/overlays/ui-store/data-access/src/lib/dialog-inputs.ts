/*export type DialogInput = {
 id: string
 component: DialogComponent
 open: boolean
 data?: unknown
 options?: DialogOptions
 }*/

export type DialogInputTemplate = {
	component: DialogComponent
}

export const DIALOG_COMPONENT = {
	MOVE_PANELS_TO_STRING: 'MovePanelsToStringV4Component',
	APP_SETTINGS: 'AppSettingsDialogComponent',
	PROFILE_SETTINGS: 'ProfileSettingsDialogComponent',
} as const

export type DialogComponent = (typeof DIALOG_COMPONENT)[keyof typeof DIALOG_COMPONENT]

// export type Dia
// type DialogComponent = MovePanelsToStringV4Component

/*type DialogInputTemplate = {
 id: string

 }*/
/*export type DialogInputType = {
 [key: string]: DialogInput<unknown>
 }*/

export type DialogInputMovePanelsToString = DialogInputTemplate & {
	component: typeof DIALOG_COMPONENT.MOVE_PANELS_TO_STRING
	data: {
		panelIds: string[]
	}
}

export type DialogInputAppSettings = DialogInputTemplate & {
	component: typeof DIALOG_COMPONENT.APP_SETTINGS
}

export type DialogInputProfileSettings = DialogInputTemplate & {
	component: typeof DIALOG_COMPONENT.PROFILE_SETTINGS
}

/*
 export const isDialogMovePanelsToString = (
 dialogInput: DialogInput,
 ): dialogInput is DialogInputMovePanelsToString => {
 return (
 !!dialogInput.data &&
 typeof dialogInput.data === 'object' &&
 'panelIds' in dialogInput.data &&
 Array.isArray(dialogInput.data.panelIds)
 )
 }
 */

/*
 const wahds: DialogInputMovePanelsToString = {
 id: 'move-panels-to-string',
 component: MovePanelsToStringV4Component,
 data: {
 panelIds: ['1', '2', '3'],
 }

 }
 */

export type DialogInput =
	| DialogInputMovePanelsToString
	| DialogInputAppSettings
	| DialogInputProfileSettings

// type ContextMenuTemplate = {
// 	x: number
// 	y: number
// }
// export type SingleEntityContextMenuTemplate = ContextMenuTemplate & {
// 	id: string
// 	type: typeof CONTEXT_MENU_TYPE.SINGLE_ENTITY
// }
// export type MultipleEntitiesContextMenuTemplate = ContextMenuTemplate & {
// 	ids: string[]
// 	type: typeof CONTEXT_MENU_TYPE.MULTIPLE_ENTITIES
// }
// export type StringContextMenuTemplate = ContextMenuTemplate & {
// 	stringId: string
// 	panelIds: string[]
// 	type: typeof CONTEXT_MENU_TYPE.STRING
// }
// export type ContextMenuType =
// 	| SingleEntityContextMenuTemplate
// 	| MultipleEntitiesContextMenuTemplate
// 	| StringContextMenuTemplate
