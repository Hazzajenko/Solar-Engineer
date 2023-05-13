/*export class StartViewDragging {
 readonly type = 'StartViewDragging'
 readonly payload = null
 }

 export class StopViewDragging {
 readonly type = 'StopViewDragging'
 readonly payload = null
 }*/
import { ContextMenuType } from './xstate-view.state'

export type StartViewDragging = {
	type: 'StartViewDragging'
}

export type StopViewDragging = {
	type: 'StopViewDragging'
}

export type OpenContextMenu = {
	type: 'OpenContextMenu'
	payload: {
		x: number
		y: number
		id: string
		type: ContextMenuType
	}
}

export type CloseContextMenu = {
	type: 'CloseContextMenu'
}

export type XStateViewEvent =
	| StartViewDragging
	| StopViewDragging
	| OpenContextMenu
	| CloseContextMenu
