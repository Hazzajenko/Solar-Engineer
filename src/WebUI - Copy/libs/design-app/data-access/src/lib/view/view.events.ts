import { ContextMenuState } from './view.state'

export type StartViewDragging = {
	type: 'StartViewDragging'
}

export type StopViewDragging = {
	type: 'StopViewDragging'
}

export type OpenContextMenu = {
	type: 'OpenContextMenu'
	payload: ContextMenuState
	/*	payload: {
	 x: number
	 y: number
	 id: string
	 type: ContextMenuType
	 }*/
}

export type CloseContextMenu = {
	type: 'CloseContextMenu'
}

export type ViewStateEvent =
	| StartViewDragging
	| StopViewDragging
	| OpenContextMenu
	| CloseContextMenu