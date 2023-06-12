import { Point } from '@shared/data-access/models'
import { PanelId, PanelLinkId, ProjectId, StringId } from '@entities/shared'

export const CONTEXT_MENU_COMPONENT = {
	MULTIPLE_PANELS_MENU: 'app-multiple-panels-menu',
	STRING_MENU: 'app-string-menu',
	SINGLE_PANEL_MENU: 'app-single-panel-menu',
	PANEL_LINK_MENU: 'app-panel-link-menu',
	COLOUR_PICKER_MENU: 'app-colour-picker-menu',
	MODE_PICKER_MENU: 'context-menu-mode-picker-menu',
	PROJECT_MENU: 'context-menu-project',
	USER_SEARCH_RESULT_MENU: 'context-menu-user-search-result',
	FRIEND_MENU: 'context-menu-friend',
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
		panelId: PanelId
	}
}
export type ContextMenuMultiplePanelsMenu = ContextMenuTemplate & {
	component: typeof CONTEXT_MENU_COMPONENT.MULTIPLE_PANELS_MENU
	data: {
		panelIds: PanelId[]
	}
}
export type ContextMenuStringMenu = ContextMenuTemplate & {
	component: typeof CONTEXT_MENU_COMPONENT.STRING_MENU
	data: {
		stringId: StringId
	}
}
export type ContextMenuPanelLinkMenu = ContextMenuTemplate & {
	component: typeof CONTEXT_MENU_COMPONENT.PANEL_LINK_MENU
	data: {
		panelLinkId: PanelLinkId
	}
}

export type ContextMenuColourPickerMenu = ContextMenuTemplate & {
	component: typeof CONTEXT_MENU_COMPONENT.COLOUR_PICKER_MENU
	data: {
		left: number
		right: number
	}
}

export type ContextMenuProjectMenu = ContextMenuTemplate & {
	component: typeof CONTEXT_MENU_COMPONENT.PROJECT_MENU
	data: {
		projectId: ProjectId
	}
}

export type ContextMenuModePickerMenu = ContextMenuTemplate & {
	component: typeof CONTEXT_MENU_COMPONENT.MODE_PICKER_MENU
	data: {
		divIdToTrackLeft: string
	}
}

export type ContextMenuUserSearchResultMenu = ContextMenuTemplate & {
	component: typeof CONTEXT_MENU_COMPONENT.USER_SEARCH_RESULT_MENU
	data: {
		userId: string
	}
}

export type ContextMenuFriendMenu = ContextMenuTemplate & {
	component: typeof CONTEXT_MENU_COMPONENT.FRIEND_MENU
	data: {
		userId: string
	}
}

export type ContextMenuInput =
	| ContextMenuSinglePanelMenu
	| ContextMenuMultiplePanelsMenu
	| ContextMenuStringMenu
	| ContextMenuPanelLinkMenu
	| ContextMenuColourPickerMenu
	| ContextMenuProjectMenu
	| ContextMenuModePickerMenu
	| ContextMenuUserSearchResultMenu
	| ContextMenuFriendMenu
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
