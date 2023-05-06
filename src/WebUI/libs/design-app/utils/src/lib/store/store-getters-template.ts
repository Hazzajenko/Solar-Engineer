/*
 import { inject } from '@angular/core';
 import { toSignal } from '@angular/core/rxjs-interop';
 import { initialSelectedState, SelectedState, selectSelectedState } from '@design-app/data-access';
 import { select, Store } from '@ngrx/store';


 /!*export type StoreGetter<T extends object> = {
 [K in keyof T]: MemoizedSelector<T, T[K]>
 }*!/
 /!*export type StoreGetter<T extends object> = {
 [K in keyof T]: MemoizedSelector<T, T[K]>
 }*!/
 export type StoreGetter<T extends object> = {
 [K in keyof T]: () => T[K]
 // [K in keyof SelectedState]: () => SelectedState[K]
 }
 type StoreGettersTemp = {
 [K in keyof SelectedState]: () => SelectedState[K]
 }
 type StoreGettersTempGen<T> = {
 [K in keyof T]: () => T[K]
 }

 // export type StoreGetter<T extends object, K extends keyof T> = MemoizedSelector<T, T[K]>
 export abstract class StoreGettersTemplate<T extends Record<string, any>> {
 [key: string]: () => T[keyof T]

 // getters: StoreGettersTempGen<T> = {} as StoreGettersTempGen<T>

 constructor() {
 const getters: StoreGettersTempGen<T> = {} as StoreGettersTempGen<T>
 Object.keys(getters).forEach((key) => {
 this[key] = getters[key]
 /!*			getters[key ] = () => {
 return this.state[key]
 }*!/
 })
 /!*		Object.keys(object).forEach((key) => {
 this[key] = object[key]
 })*!/
 /!*		for (const key in this.getters) {
 this.getters[key] = () => {
 return this.state[key]
 // return this.object[key]
 }
 }*!/
 }

 // abstract get state(): T
 }

 class SelectedStoreClassTest extends StoreGettersTemplate<SelectedState> {
 /!*	get state() {
 return selectedState()
 }*!/
 }

 // const selectedState = initialSelectedState
 const testy = new SelectedStoreClassTest()
 // testy['dsa']


 const selectedStore = inject(Store<SelectedState>)
 const selectedState$ = selectedStore.pipe(select(selectSelectedState))
 const selectedState = toSignal(selectedState$, {
 initialValue: initialSelectedState,
 })

 const getFunc = <T extends object, K extends keyof T>(key: K) => {
 return selectedState()[key as keyof SelectedState]
 }

 const getFunc2 = {
 get multipleSelectedEntityIds() {
 return selectedState().multipleSelectedEntityIds
 },
 }

 type getfunccc = (typeof getFunc2)['multipleSelectedEntityIds']
 const wahat: getfunccc = ['']

 const getFunc3: StoreGettersTemp = {
 selectedStringId() {
 return selectedState().selectedStringId
 },
 singleSelectedEntityId() {
 return selectedState().singleSelectedEntityId
 },
 multipleSelectedEntityIds() {
 return selectedState().multipleSelectedEntityIds
 },
 entityState() {
 return selectedState().entityState
 },
 }

 const getFunc4: StoreGettersTempGen<SelectedState> = {
 selectedStringId() {
 return selectedState().selectedStringId
 },
 singleSelectedEntityId() {
 return selectedState().singleSelectedEntityId
 },
 multipleSelectedEntityIds() {
 return selectedState().multipleSelectedEntityIds
 },
 entityState() {
 return selectedState().entityState
 },
 }
 /!*
 class SelectedStoreGetters extends StoreGettersTemplate<SelectedState>

 *!/*/
