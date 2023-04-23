/*
 import { InitialSelectedState } from '@design-app/feature-design-canvas'

 ClearSelected: (ctx) => {
 return (ctx.selected = InitialSelectedState)
 },
 SetSelectedEntity: (ctx, event) => {
 const payload = event['payload']
 return (ctx.selected = {
 ...ctx.selected,
 singleSelectedId: payload.id,
 multipleSelectedIds: [],
 selectedStringId: undefined,
 })
 },*/
import { AnyEventObject } from 'xstate';


export type CanvasAppAction =
  | {
      type: 'ClearSelected'
      payload: {}
    }
  | {
      type: 'SetSelectedEntity'
      payload: {
        id: string
      }
    }
  | {
      type: 'SetMultipleSelectedEntities'
      payload: {
        ids: string[]
      }
    }
  | {
      type: 'AddEntityToMultipleSelected'
      payload: {
        id: string
      }
    }
  | {
      type: 'SetSelectedString'
      payload: {
        id: string
      }
    }

export type ActionByType<T extends CanvasAppAction['type']> = Extract<
  CanvasAppAction,
  {
    type: T
  }
>

export const isActionByType = <T extends CanvasAppAction['type']>(
  action: CanvasAppAction,
  type: T,
): action is ActionByType<T> => action.type === type

/*const action = {
 type: 'SetSelectedEntity',
 payload: {
 id: '123',
 }
 } as unknown

 if (isActionByType(action, 'SetSelectedEntity')) {
 console.log(action.payload.id)
 }*/

export const actionByType = <T extends CanvasAppAction['type']>(type: T): ActionByType<T> => {
  return {
    type,
  } as any
}

const action = actionByType('SetSelectedEntity')
// action.payload.id

export const actionByTypeWithPayload = <T extends CanvasAppAction['type']>(
  type: T,
  payload: ActionByType<T>['payload'],
): ActionByType<T> => {
  return {
    type,
    payload,
  } as any
}

export const isActionType = <T extends CanvasAppAction['type']>(
  action: CanvasAppAction,
  type: T,
): action is ActionByType<T> => action.type === type

export const isActionTypeFromAnyEventObject = <T extends CanvasAppAction['type']>(
  event: AnyEventObject,
  type: T,
): event is ActionByType<T> => isActionType(event as any, type)

export const getActionFromAnyEventObject = <T extends CanvasAppAction['type']>(
  event: AnyEventObject,
  type: T,
): ActionByType<T> | undefined => {
  if (isActionType(event as any, type)) {
    return event as ActionByType<T>
  }
  return undefined
}
/*

 const action: ActionByType<'SetSelectedEntity'> = {
 type: 'SetSelectedEntity',
 payload: {
 id: '123',
 }
 }

 const action2: ActionByType<'ClearSelected'> = {
 type: 'ClearSelected',
 }
 */