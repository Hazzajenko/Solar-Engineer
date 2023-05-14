import { Point } from '../location'
import { Size } from '../object'

export type DraggableWindow = {
	id: string
	title: string
	location: Point
	size: Size
	isOpen: boolean
}
