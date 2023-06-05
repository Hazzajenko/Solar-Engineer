/*
 import { StringsActions } from './strings.actions'
 import { initialStringsState, StringsState } from './strings.reducer'
 import { selectAllStrings, selectStringsState } from './strings.selectors'
 import { inject, Injectable } from '@angular/core'
 import { toSignal } from '@angular/core/rxjs-interop'
 import { UpdateStr } from '@ngrx/entity/src/models'
 import { select, Store } from '@ngrx/store'
 import { StringModel } from '@entities/shared'

 @Injectable({
 providedIn: 'root',
 })
 export class StringsStoreService {
 private readonly _store = inject(Store<StringsState>)
 private readonly _state$ = this._store.pipe(select(selectStringsState))
 private readonly _state = toSignal(this._state$, {
 initialValue: initialStringsState,
 })
 private readonly _strings$ = this._store.pipe(select(selectAllStrings))

 // readonly dispatch = new StringsRepository(this._store)

 get state() {
 return this._state()
 }

 get ids() {
 return this.state.ids
 }

 get entities() {
 return this.state.entities
 }

 get allStrings() {
 return this._store.selectSignal(selectAllStrings)
 // return this.state.ids.map((id) => this.entities[id]).filter(isNotNull)
 }

 get allStrings$() {
 return this._strings$
 }

 /!*
 get allStringsWithPanels$() {
 return this._store.pipe(select(selectAllStringsWithPanels))
 }*!/

 getById(id: string) {
 return this.entities[id]
 }

 addString(freeString: StringModel) {
 this._store.dispatch(StringsActions.addString({ string: freeString }))
 }

 addManyStrings(strings: StringModel[]) {
 this._store.dispatch(StringsActions.addManyStrings({ strings }))
 }

 updateString(update: UpdateStr<StringModel>) {
 this._store.dispatch(StringsActions.updateString({ update }))
 }

 updateManyStrings(updates: UpdateStr<StringModel>[]) {
 this._store.dispatch(StringsActions.updateManyStrings({ updates }))
 }

 deleteString(id: string) {
 this._store.dispatch(StringsActions.deleteString({ stringId: id }))
 }

 deleteManyStrings(ids: string[]) {
 this._store.dispatch(StringsActions.deleteManyStrings({ stringIds: ids }))
 }

 clearStringsState() {
 this._store.dispatch(StringsActions.clearStringsState())
 }
 }

 class StringsRepository {
 constructor(private readonly _store: Store<StringsState>) {}

 addString(freeString: StringModel) {
 this._store.dispatch(StringsActions.addString({ string: freeString }))
 }

 addManyStrings(strings: StringModel[]) {
 this._store.dispatch(StringsActions.addManyStrings({ strings }))
 }

 updateString(update: UpdateStr<StringModel>) {
 this._store.dispatch(StringsActions.updateString({ update }))
 }

 updateManyStrings(updates: UpdateStr<StringModel>[]) {
 this._store.dispatch(StringsActions.updateManyStrings({ updates }))
 }

 deleteString(id: string) {
 this._store.dispatch(StringsActions.deleteString({ stringId: id }))
 }

 deleteManyStrings(ids: string[]) {
 this._store.dispatch(StringsActions.deleteManyStrings({ stringIds: ids }))
 }

 clearStringsState() {
 this._store.dispatch(StringsActions.clearStringsState())
 }
 }
 */
