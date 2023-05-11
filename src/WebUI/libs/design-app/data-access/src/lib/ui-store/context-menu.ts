import { Point } from '@shared/data-access/models'

export const CONTEXT_MENU_COMPONENT = {
	MULTIPLE_PANELS_MENU: 'app-multiple-panels-menu',
	STRING_MENU: 'app-string-menu',
	SINGLE_PANEL_MENU: 'app-single-panel-menu',
} as const
export type ContextMenuComponent =
	(typeof CONTEXT_MENU_COMPONENT)[keyof typeof CONTEXT_MENU_COMPONENT]
type ContextMenuTemplate = {
	location: Point
	component: ContextMenuComponent
}
export type ContextMenuSinglePanelMenu = ContextMenuTemplate & {
	component: typeof CONTEXT_MENU_COMPONENT.SINGLE_PANEL_MENU
	data: {
		panelId: string
	}
}
export type ContextMenuMultiplePanelsMenu = ContextMenuTemplate & {
	component: typeof CONTEXT_MENU_COMPONENT.MULTIPLE_PANELS_MENU
	data: {
		panelIds: string[]
	}
}
export type ContextMenuStringMenu = ContextMenuTemplate & {
	component: typeof CONTEXT_MENU_COMPONENT.STRING_MENU
	data: {
		stringId: string
	}
}
export type ContextMenuInput =
	| ContextMenuSinglePanelMenu
	| ContextMenuMultiplePanelsMenu
	| ContextMenuStringMenu

// export const
/*
 const uhm: ContextMenuInput = {
 location: { x: 0, y: 0 },
 component: CONTEXT_MENU_COMPONENT.SINGLE_PANEL_MENU,
 data: {
 panelId: '',
 },
 }
 */
