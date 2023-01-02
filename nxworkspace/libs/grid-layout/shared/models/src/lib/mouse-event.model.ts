import { CdkDragDrop } from '@angular/cdk/drag-drop'
import { BlockModel } from '@shared/data-access/models'

/* export type MouseEventRequest = {
  event: MouseEvent
  location: string
}

export type EventType = 'CLICK' | 'MOUSE' | 'DROP' */

export type MouseClickEvent = {
  type: 'CLICK'
  event: MouseEvent
  location: string
}

export type DragDropEvent = {
  type: 'DROP'
  event: CdkDragDrop<BlockModel[]>
}

export type MouseMoveEvent = {
  type: 'MOUSE'
  event: MouseEvent
  location: string
}

export type ControllerEvent = MouseClickEvent | DragDropEvent | MouseMoveEvent

// export type DragDropEvent = CdkDragDrop<BlockModel[]>
