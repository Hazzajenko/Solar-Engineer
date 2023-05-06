import { DialogOptions } from './dialogs.service'
import { ComponentType } from '@angular/cdk/overlay'

export type DialogInput<T> = {
	id: string
	component: ComponentType<T>
	data?: unknown
	options?: DialogOptions
}

/*export type DialogInputType = {
 [key: string]: DialogInput<unknown>
 }*/

export type DialogInputMovePanelsToString = {
	panelIds: string[]
}

export type DialogInputType = DialogInputMovePanelsToString

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