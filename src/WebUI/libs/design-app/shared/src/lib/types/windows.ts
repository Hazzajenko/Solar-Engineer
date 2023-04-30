import { Point, Size } from '@shared/data-access/models'

export type DraggableWindow = {
	id: string
	title: string
	location: Point
	size: Size
	isOpen: boolean
}