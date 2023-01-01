import { MultiStateModel } from '@project-id/shared/models'
import { MouseEventRequest } from '@grid-layout/shared/models'
import { CdkDragDrop } from '@angular/cdk/drag-drop'
import { BlockModel } from '@shared/data-access/models'

export type MouseMove = MouseEventRequest & MultiStateModel

export type MouseClickEvent = {
  request: MouseEventRequest
  multiState: MultiStateModel
}

export type MouseMoveEvent = {
  request: MouseEventRequest
  multiState: MultiStateModel
}

export type DragDropEvent = CdkDragDrop<BlockModel[]>
// const yes: MouseMoveEvent = {request: {event: } }

export type ControllerEvent = MouseEventRequest | DragDropEvent | MouseMoveEvent

console.log()

type Result = true extends boolean ? 1 : 0
type Result2 = boolean extends true ? 1 : 0

export const doSomething = (params1: string): string => {
  return params1
}
const func = (check: boolean) => {
  return '32132131'
}

type FuncResult = ReturnType<typeof func>

// type ReturnType<T extends (...args: any) => any> = T extends (...args: any) => infer R ? R : any;

type Result3 = typeof func extends (...args: any) => any ? 1 : 0
// type Result3 = typeof func extends (...args: any) => infer R ? R : any

const str = 'hello_world-friend'.replace(/(_|-)/g, (item) => {
  return `${item}${item}${item}`
})

console.log(str)