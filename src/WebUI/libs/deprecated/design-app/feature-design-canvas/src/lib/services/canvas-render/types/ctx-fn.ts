import { StateUpdate } from '../../canvas-client-state'

export type CtxFn = (ctx: CanvasRenderingContext2D) => void

export type OptionalCtxFn = CtxFn | undefined

// eslint-disable-next-line @typescript-eslint/no-empty-function
export const EmptyCtxFn: CtxFn = () => {}

export type CanvasUpdate = {
	ctxFn: OptionalCtxFn
	changes: StateUpdate[]
}

/*
 export type CtxFnWithChanges = {
 ctxFn: CtxFn
 changes: CanvasChange[]
 }

 const deepPartial = <T>(obj: T): DeepPartial<T> => obj as DeepPartial<T>
 // type StateUpdate = DeepPartial<CanvasClientState>
 type StateUpdateFn = (state: CanvasState) => StateUpdate
 const update: StateUpdate = {
 nearby: {
 ids: [],
 entities: {},
 },
 }
 */

// const yo = deepPartial(update)
// yo.nearby.ids.push('1')
/*type StateUpdateFnWithChanges = {
 stateUpdateFn: StateUpdateFn
 changes: CanvasChange[]

 }*/
// const a = deepPartial({CanvasRenderingContext2D: 1})
// deepPartial({})
/*
 export const createCtxFn = (
 ctxFn: CtxFn,
 changes: CanvasChange[],
 ): CtxFnWithChanges => {
 return {
 ctxFn,
 changes,
 }
 }*/
