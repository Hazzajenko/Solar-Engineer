import { TransformedPoint } from '../../../types'

export type CanvasAppMachineEvent =
  | {
      type: 'Click Elsewhere'
      payload: {}
    }
  | {
      type: 'Cancel Selected'
      payload: {}
    }
  | {
      type: 'Click On Entity'
      payload: {
        id: string
      }
    }
  | {
      type: 'Start Selection Box'
      payload: {
        point: TransformedPoint
      }
    }
  | {
      type: 'Selected Multiple Entities'
      payload: {
        ids: string[]
      }
    }
  | {
      type: 'Selection Box Cancelled'
      payload: {}
    }
  | {
      type: 'Clicked On Different Entity'
      payload: {
        id: string
      }
    }
  | {
      type: 'Add Entity To Multiple Selected'
      payload: {
        id: string
      }
    }

/*
 import { TransformedPoint } from '../../../types';
 import { Filter } from '@shared/utils';


 /!*export const CANVAS_APP_MACHINE_EVENT = {
 CLICK_ELSEWHERE: {
 type: 'Click Elsewhere',
 },
 CANCEL_SELECTED: {
 type: 'Cancel Selected',
 },
 CLICK_ON_ENTITY: {
 type: 'Click On Entity',
 /!*   payload: {
 id: string
 }*!/
 },
 START_SELECTION_BOX: {
 type: 'Start Selection Box',
 },
 SELECTED_MULTIPLE_ENTITIES: {
 type: 'Selected Multiple Entities',
 },
 SELECTION_BOX_CANCELLED: {
 type: 'Selection Box Cancelled',
 },
 CLICKED_ON_DIFFERENT_ENTITY: {
 type: 'Clicked On Different Entity',
 },
 ADD_ENTITY_TO_MULTIPLE_SELECTED: {
 type: 'Add Entity To Multiple Selected',
 }
 /!*  CANCEL_SELECTED: 'Cancel Selected',
 CLICK_ON_ENTITY: 'Click On Entity',
 START_SELECTION_BOX: 'Start Selection Box',
 SELECTED_MULTIPLE_ENTITIES: 'Selected Multiple Entities',
 SELECTION_BOX_CANCELLED: 'Selection Box Cancelled',
 CLICKED_ON_DIFFERENT_ENTITY: 'Clicked On Different Entity',
 ADD_ENTITY_TO_MULTIPLE_SELECTED: 'Add Entity To Multiple Selected',*!/
 } as const;*!/

 export type CanvasAppMachineEvent =
 | {
 type: 'Click Elsewhere'
 payload: {}
 }
 | {
 type: 'Cancel Selected'
 payload: {}
 }
 | {
 type: 'Click On Entity'
 payload: {
 id: string
 }
 }
 | {
 type: 'Start Selection Box'
 payload: {
 point: TransformedPoint
 }
 }
 | {
 type: 'Selected Multiple Entities'
 payload: {
 ids: string[]
 }
 }
 | {
 type: 'Selection Box Cancelled'
 payload: {}
 }
 | {
 type: 'Clicked On Different Entity'
 payload: {
 id: string
 }
 }
 | {
 type: 'Add Entity To Multiple Selected'
 payload: {
 id: string
 }
 }

 export const CanvasAppMachineEventRecord: Record<string, CanvasAppMachineEvent> = {
 'Click Elsewhere': {
 type: 'Click Elsewhere',
 payload: {},
 },
 'Cancel Selected': {
 type: 'Cancel Selected',
 payload: {},
 },
 'Click On Entity': {
 type: 'Click On Entity',
 payload: {
 id: '',
 },
 },
 }

 export type CanvasAppMachineEventByKeyV1 = Filter<CanvasAppMachineEvent>

 export type CanvasAppMachineEventByKey = {
 'Click Elsewhere': {
 type: 'Click Elsewhere'
 payload: {}
 }
 'Cancel Selected': {
 type: 'Cancel Selected'
 payload: {}
 }
 'Click On Entity': {
 type: 'Click On Entity'
 payload: {
 id: string
 }
 }
 'Start Selection Box': {
 type: 'Start Selection Box'
 payload: {
 point: TransformedPoint
 }
 }
 'Selected Multiple Entities': {
 type: 'Selected Multiple Entities'
 payload: {
 ids: string[]
 }
 }
 'Selection Box Cancelled': {
 type: 'Selection Box Cancelled'
 payload: {}
 }
 'Clicked On Different Entity': {
 type: 'Clicked On Different Entity'
 payload: {
 id: string
 }
 }
 'Add Entity To Multiple Selected': {
 type: 'Add Entity To Multiple Selected'
 payload: {
 id: string
 }
 }
 }

 /!*export const CANVAS_APP_MACHINE_EVENT = {
 'Click Elsewhere': {
 type: 'Click Elsewhere',
 payload: {},
 },
 'Cancel Selected': {
 type: 'Cancel Selected',
 payload: {},
 },
 'Click On Entity': {
 type: 'Click On Entity',
 payload: {
 id: '',
 }
 }

 }*!/

 export type CanvasAppMachineEventType = CanvasAppMachineEvent['type']

 export type CanvasAppMachineEventByKeyType<T extends CanvasAppMachineEventType> =
 CanvasAppMachineEventByKey[T]

 export type CanvasAppMachineEventPayloadV2<T extends CanvasAppMachineEvent> = T extends {
 payload: infer P
 }
 ? P
 : never

 export type CanvasAppMachineEventPayload<T extends CanvasAppMachineEventType> =
 CanvasAppMachineEventByKey[T]['payload']

 export type CanvasAppMachineEventPayloadByType<T extends CanvasAppMachineEventType> =
 CanvasAppMachineEventByKey[T]['payload']

 export const CANVAS_APP_MACHINE_EVENT = {
 'Click Elsewhere': {
 type: 'Click Elsewhere',
 payload: {},
 },
 'Cancel Selected': {
 type: 'Cancel Selected',
 payload: {},
 },
 'Click On Entity': {
 type: 'Click On Entity',
 payload: {
 id: '',
 },
 },
 }

 const payloadFor: CanvasAppMachineEventPayloadByType<'Click On Entity'> = {
 id: '',
 }

 export const getEventPayloadByType = <T extends CanvasAppMachineEvent, X extends T['type']>(
 event: T,
 ): event is CanvasAppMachineEventPayloadByType<T> => {
 return event.type === 'Click On Entity'
 /!*  return (event: CanvasAppMachineEvent) => {
 if (event.type === type) {
 return event.payload
 }
 return undefined
 }*!/
 }

 export function getEventPayloadByTypeV2<T extends CanvasAppMachineEvent, X extends T['type']>(
 event: T,
 type: X,
 ): event is CanvasAppMachineEventPayloadByType<X> {
 if (event.type === type) {
 if (typeof event === 'object') {
 return true
 }
 // return event.payload
 }
 return false
 // const what = type
 // return 'payload' in event
 }

 export function getEventPayloadByTypeV5<T extends object>(
 event: T,
 ): event is CanvasAppMachineEventPayloadV2<T> {
 if (!('type' in event)) return false
 if (!('payload' in event)) return false
 return true

 // const what = type
 // return 'payload' in event
 }

 const event: CanvasAppMachineEvent = {
 type: 'Click On Entity',
 payload: {
 id: '123',
 },
 }

 const testPayload = getEventPayloadByType(event)

 type TestEvent = {
 type: string
 payload: any
 }

 export function getEventPayloadByTypeV3(
 event: CanvasAppMachineEvent,
 type: CanvasAppMachineEventType,
 ) {
 if (event.type === type) {
 return event.payload
 }
 return undefined
 }

 export type CanvasAppMachineEventTypeV2 =
 | 'Click Elsewhere'
 | 'Cancel Selected'
 | 'Click On Entity'
 | 'Start Selection Box'
 | 'Selected Multiple Entities'
 | 'Selection Box Cancelled'
 | 'Clicked On Different Entity'
 | 'Add Entity To Multiple Selected'

 export type CanvasAppMachineEventPayloadV22<T extends CanvasAppMachineEventTypeV2> =
 CanvasAppMachineEventByKey[T]['payload']

 export function getEventPayloadByTypeV555<T extends CanvasAppMachineEvent>(
 event: T,
 ): event is CanvasAppMachineEventByKey['Click On Entity'] {
 if (typeof event !== 'object') return false
 if (event === null) return false
 if (!('type' in event)) return false
 if (!('payload' in event)) return false
 if (
 event.type === 'Click On Entity' &&
 typeof event.payload === 'object' &&
 event.payload !== null
 ) {
 // return true
 if ('id' in event.payload) {
 return true
 }
 }
 return false
 // if (event satisfies CanvasAppMachineEventPayloadV22<T>) return false
 // return true
 }

 /!*export function groupBy<T extends Record<PropertyKey, any>, Key extends Filter<T>>(
 arr: T[],
 key: Key,
 ): Record<T[Key], T[]> {*!/

 export function getEventPayloadByTypeV555555<T extends CanvasAppMachineEvent, K extends Filter<T>>(
 event: CanvasAppMachineEvent,
 key: K,
 ): event is CanvasAppMachineEventByKey[K] {
 if (typeof event !== 'object') return false
 if (event === null) return false
 if (!('type' in event)) return false
 if (!('payload' in event)) return false
 if (
 event.type === 'Click On Entity' &&
 typeof event.payload === 'object' &&
 event.payload !== null
 ) {
 if ('id' in event.payload) {
 return true
 }
 }
 return false
 }

 /!*const dadada = getEventPayloadByTypeV555555(event)
 // dadada.valueOf().valueOf
 event.payload.id*!/
 export function getEventPayloadByTypeV7<T extends object>(
 event: T,
 ): event is CanvasAppMachineEventPayloadV22<CanvasAppMachineEventTypeV2> {
 if (!('type' in event)) return false
 if (!('payload' in event)) return false

 const type = event.type as CanvasAppMachineEventTypeV2
 const expectedPayload = CANVAS_APP_MACHINE_EVENT[type].payload

 if (!expectedPayload) {
 return false
 }

 const actualPayload = event.payload

 return Object.keys(expectedPayload).every((key) => {
 const expectedValue = expectedPayload[key]
 const actualValue = actualPayload[key]
 return expectedValue === actualValue
 })
 }

 /!*export function isPanel(entity: CanvasEntity): entity is CanvasPanel {
 return entity.type === ENTITY_TYPE.Panel
 }

 export function assertIsPanel(entity: CanvasEntity): asserts entity is CanvasPanel {
 if (!isPanel(entity)) {
 throw new Error(`Expected entity to be a panel, but was ${entity.type}`)
 }
 }*!/
 /!*export const getEventPayloadByType = <T extends CanvasAppMachineEventType>(type: T):  CanvasAppMachineEventPayloadByType<T> => {
 type val = CanvasAppMachineEventPayloadByType<T>
 return val
 // return CANVAS_APP_MACHINE_EVENT[type].payload
 }*!/

 /!*
 export const getEventPayloadByType = <T extends CanvasAppMachineEventType>(type: T) => {
 return (event: CanvasAppMachineEvent) => {
 if (event.type === type) {
 return event.payload
 }
 return undefined
 }
 }*!/

 /!*export const getEventPayloadByType = <T extends CanvasAppMachineEventType>(type: T) => {
 return (event: CanvasAppMachineEvent) => {
 if (event.type === type) {
 return event.payload
 }
 return undefined
 }
 /!*  return (event: CanvasAppMachineEvent) => {
 if (event.type === type) {
 return event.payload
 }
 return undefined
 }*!/
 }*!/

 /!*export type CanvasAppMachineState =
 | {
 value: 'Selected State'
 context: {}
 }
 | {
 value: 'Selected State.Entity Selected'
 context: {}
 }
 | {
 value: 'Selected State.Multiple Entities Selected'
 context: {}
 }
 | {
 value: 'Selected State.None Selected'
 context: {}
 }
 | {
 value: 'Selected State.Selected Box Start Point Set'
 context: {}
 }
 *!/
 /!*export type CanvasAppMachineContext = {}

 export type CanvasAppMachineSchema = {
 states: {
 'Selected State': {
 states: {
 'Entity Selected': {}
 'Multiple Entities Selected': {}
 'None Selected': {}
 'Selected Box Start Point Set': {}
 }
 on: {
 'Cancel Selected': {
 cond: 'Selected Is Defined'
 }
 }
 }
 }
 }*!/

 /!*
 export type CanvasAppMachineTypegenMeta = {
 '@@xstate/typegen': true
 internalEvents: {
 'xstate.init': {
 type: 'xstate.init'
 }
 }
 invokeSrcNameMap: {}
 missingImplementations: {
 actions: 'Add Entity To Multiple Selected' | 'Clear Selected' | 'Clear Selection Box Start' | 'Set Multiple Selected Entities' | 'Set Selected Entity' | 'Set Selection Box Start'
 delays: never
 guards: 'Selected Is Defined'

 }
 }*!/*/