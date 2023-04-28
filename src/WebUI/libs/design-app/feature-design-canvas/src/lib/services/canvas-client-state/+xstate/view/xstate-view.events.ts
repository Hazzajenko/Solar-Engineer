/*export class StartViewDragging {
 readonly type = 'StartViewDragging'
 readonly payload = null
 }

 export class StopViewDragging {
 readonly type = 'StopViewDragging'
 readonly payload = null
 }*/
import { EntityType } from '@design-app/shared';


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
		type: EntityType
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