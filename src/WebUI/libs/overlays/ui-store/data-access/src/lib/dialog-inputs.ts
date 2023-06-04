export type DialogInputTemplate = {
	// component: T
	component: DialogComponent
}

// type test = DialogInputTemplate<typeof DIALOG_COMPONENT_TYPE.SIGN_IN>

export const DIALOG_COMPONENT = {
	MOVE_PANELS_TO_STRING: 'MovePanelsToStringComponent',
	APP_SETTINGS: 'AppSettingsDialogComponent',
	PROFILE_SETTINGS: 'ProfileSettingsDialogComponent',
	SIGN_IN: 'SignInDialogComponent',
	CREATE_PROJECT: 'DialogCreateProjectComponent',
} as const

export type DialogComponent = (typeof DIALOG_COMPONENT)[keyof typeof DIALOG_COMPONENT]

// DIALOG_COMPONENT_TYPE.
/*export const DIALOG_COMPONENT_TYPE = {
 MOVE_PANELS_TO_STRING: MovePanelsToStringDialogComponent.prototype.constructor.name,
 APP_SETTINGS: AppSettingsDialogComponent.prototype,
 PROFILE_SETTINGS: ProfileSettingsDialogComponent.prototype,
 SIGN_IN: SignInDialogComponent.prototype,
 CREATE_PROJECT: DialogCreateProjectComponent.prototype,
 } as const

 type comp = MovePanelsToStringDialogComponent
 type comp2 = typeof MovePanelsToStringDialogComponent.prototype

 export type DialogComponentType = (typeof DIALOG_COMPONENT_TYPE)[keyof typeof DIALOG_COMPONENT_TYPE]*/

export type DialogInputMovePanelsToString = DialogInputTemplate & {
	// typeof DIALOG_COMPONENT_TYPE.MOVE_PANELS_TO_STRING
	component: typeof DIALOG_COMPONENT.MOVE_PANELS_TO_STRING
	data: {
		panelIds: string[]
	}
}

/*private getTypeOf(d:any): string {
 let type:string = typeof d;
 if (type === 'function') {
 let metaKeys:string = Reflect.getMetadataKeys(d);
 if (metaKeys.indexOf('annotations') > 0) {
 let annotations:string[] = Reflect.getMetadata('annotations', d);
 if (annotations.indexOf('@Component') > 0) {
 type = '@Component';
 }
 }
 }
 return type;
 }*/
/*

 const wahtt: DialogInputMovePanelsToString = {
 component: DIALOG_COMPONENT_TYPE.MOVE_PANELS_TO_STRING,
 data: {
 panelIds: ['1', '2'],
 },
 }
 */

export type DialogInputAppSettings = DialogInputTemplate & {
	// component: typeof DIALOG_COMPONENT_TYPE.APP_SETTINGS
	component: typeof DIALOG_COMPONENT.APP_SETTINGS
}

export type DialogInputProfileSettings = DialogInputTemplate & {
	// component: typeof DIALOG_COMPONENT_TYPE.PROFILE_SETTINGS
	component: typeof DIALOG_COMPONENT.PROFILE_SETTINGS
}

export type DialogInputSignIn = DialogInputTemplate & {
	// component: typeof DIALOG_COMPONENT_TYPE.SIGN_IN
	component: typeof DIALOG_COMPONENT.SIGN_IN
}

export type DialogInputCreateProject = DialogInputTemplate & {
	// component: typeof DIALOG_COMPONENT_TYPE.CREATE_PROJECT
	component: typeof DIALOG_COMPONENT.CREATE_PROJECT
}

export type DialogInput =
	| DialogInputMovePanelsToString
	| DialogInputAppSettings
	| DialogInputProfileSettings
	| DialogInputSignIn
	| DialogInputCreateProject

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
