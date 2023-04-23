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
import { AnyEventObject, EventObject } from 'xstate';


// export type EmptyEvent = {}
// emptyProps()

export type CanvasAppSelectedActions =
  | {
      type: 'ClearSelected'
      payload: null
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

export type CanvasAppActionType = CanvasAppSelectedActions['type']
export type CanvasAppActionByType<T extends CanvasAppActionType> = Extract<
  CanvasAppSelectedActions,
  {
    type: T
  }
>
const asdsa: CanvasAppActionByType<'ClearSelected'> = {
  type: 'ClearSelected',
  payload: {
    id: '123',
  },
}
export type CanvasAppActionPayload = CanvasAppSelectedActions['payload']

export const CanvasAppActionType = {
  ClearSelected: 'ClearSelected',
  SetSelectedEntity: 'SetSelectedEntity',
  SetMultipleSelectedEntities: 'SetMultipleSelectedEntities',
  AddEntityToMultipleSelected: 'AddEntityToMultipleSelected',
  SetSelectedString: 'SetSelectedString',
} as const

/*export type EventPayload = {
 [CanvasAppActionType.ClearSelected]: {}
 [CanvasAppActionType.SetSelectedEntity]: {
 id: string
 }
 [CanvasAppActionType.SetMultipleSelectedEntities]: {
 ids: string[]
 }
 [CanvasAppActionType.AddEntityToMultipleSelected]: {
 id: string
 }
 [CanvasAppActionType.SetSelectedString]: {
 id: string
 }
 }*/

// const sdasd : EventPayload = {
/* [CanvasAppActionType.ClearSelected]: {},
 SetSelectedEntity: {
 id: '123',
 }*/
// }

// CanvasAppActionType.AddEntityToMultipleSelected

export type CanvasAppMachineEvent = {
  type: CanvasAppActionType
  payload: CanvasAppActionPayload
}

export type CanvasAppMachineEventPayload<T extends CanvasAppActionType> = Extract<
  CanvasAppMachineEvent,
  {
    type: T
  }
>['payload']

export type CanvasAppMachineEvent2<TType extends CanvasAppActionType> = {
  type: TType
  payload: CanvasAppMachineEventPayload<TType>
}
/*

 const yoo: CanvasAppMachineEvent2<any> = {
 type:    'ClearSelected',
 payload: {
 id: '123',
 }
 }
 */

// const dsadas: CanvasAppActionType = 'SetSelectedEntity'

export type ActionByType<T extends CanvasAppSelectedActions['type']> = Extract<
  CanvasAppSelectedActions,
  {
    type: T
  }
>

export const isActionByType = <T extends CanvasAppSelectedActions['type']>(
  action: CanvasAppSelectedActions,
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

export const actionByType = <T extends CanvasAppSelectedActions['type']>(
  type: T,
): ActionByType<T> => {
  return {
    type,
  } as any
}

// const action = actionByType('SetSelectedEntity')
// action.payload.id

export const actionByTypeWithPayload = <T extends CanvasAppSelectedActions['type']>(
  type: T,
  payload: ActionByType<T>['payload'],
): ActionByType<T> => {
  return {
    type,
    payload,
  } as any
}

export const isActionType = <T extends CanvasAppSelectedActions['type']>(
  action: CanvasAppSelectedActions,
  type: T,
): action is ActionByType<T> => action.type === type

export const isActionTypeFromAnyEventObject = <T extends CanvasAppSelectedActions['type']>(
  event: AnyEventObject,
  type: T,
): event is ActionByType<T> => isActionType(event as any, type)

export const getActionFromAnyEventObject = <T extends CanvasAppSelectedActions['type']>(
  event: AnyEventObject,
  type: T,
): ActionByType<T> | undefined => {
  if (isActionType(event as any, type)) {
    return event as ActionByType<T>
  }
  return undefined
}

export const isActionTypeF = <T extends CanvasAppSelectedActions['type']>(
  action: AnyEventObject,
  type: T,
): action is ActionByType<T> => action.type === type

export const assertActionIsForType = <T extends CanvasAppSelectedActions['type']>(
  action: AnyEventObject,
  type: T,
): asserts action is ActionByType<T> => {
  if (!isActionTypeF(action, type)) {
    throw new Error(`Action is not of type ${type}`)
  }
}

export function assertEventType<TE extends EventObject, TType extends TE['type']>(
  event: TE,
  eventType: TType,
): asserts event is TE & {
  type: TType
} {
  if (event.type !== eventType) {
    throw new Error(`Invalid event: expected "${eventType}", got "${event.type}"`)
  }
}

export function assertEventType2<TE extends AnyEventObject, TType extends TE['type']>(
  event: TE,
  eventType: TType,
): asserts event is TE & {
  type: TType
} {
  if (event.type !== eventType) {
    throw new Error(`Invalid event: expected "${eventType}", got "${event.type}"`)
  }
}

export const getPayloadFromAnyEventObject = <TE extends AnyEventObject, TType extends TE['type']>(
  event: TE,
  eventType: TType,
):
  | {
      id: string
    }
  | {
      ids: string[]
    }
  | null
  | undefined => {
  if (isActionTypeF(event, eventType as CanvasAppSelectedActions['type'])) {
    return event.payload
  }
  return undefined
}

export const isValidEventType = <TE extends AnyEventObject, TType extends TE['type']>(
  event: TE,
  eventType: TType,
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
): event is ActionByType<TType> => {
  const payload = getPayloadFromAnyEventObject(event, eventType)
  return event.type === eventType && typeof payload === (event as any).payload
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