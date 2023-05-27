import { inject, Signal } from '@angular/core'
import { Store } from '@ngrx/store'

export const selectSignalFromStore = <T>(selector: (state: any) => T): Signal<T> =>
	inject(Store).selectSignal<T>(selector)

export const selectSignalFromKnownStore = <TState, TModel extends TState[keyof TState]>(
	selector: (state: TState) => TModel,
): Signal<TModel> => inject(Store<TState>).selectSignal<TModel>(selector)

export const selectSignalFromKnownStoreV2 = <TState>(
	selector: (state: TState) => TState[keyof TState],
): Signal<TState[keyof TState]> =>
	inject(Store<TState>).selectSignal<TState[keyof TState]>(selector)

export const selectSignalFromKnownStoreV3 = <TState>(
	selector: (state: TState) => TState[keyof TState],
): Signal<TState[keyof TState]> =>
	inject(Store<TState>).selectSignal<TState[keyof TState]>(selector)
/*
 export const selectSignalFromKnownStore = <TState, TModel extends TState[keyof TState]>(
 selector: (state: TState) => TModel,
 ): Signal<TModel> => inject(Store<TState>).selectSignal<TModel>(selector)
 /
 export const selectSignalFromStore = <T>(selector: (state: any) => T): Signal<T> => {
 const store = inject(Store)
 return store.selectSignal<T>(selector)
 }


 type Selector<T> = (state: any) => T

 type VariableOf<T> = T extends Selector<infer U> ? U : never

 type SignalOf<T> = Signal<VariableOf<T>>

 /
 const idk: VariableOf<SelectedState> = {
 singleSelectedPanelId: undefined,
 multipleSelectedEntityIds: [],
 selectedStringId: undefined,
 }*!/

 type ValuesOfObject<T> = T[keyof T]
 type KeysOfObject<T> = keyof T
 type ValueFromKey<T, K extends keyof T> = T[K]
 const uhm: ValueFromKey<SelectedState, 'selectedStringId'> = 'test'

 const idk: ValuesOfObject<SelectedState> = undefined
 const idk3: KeysOfObject<SelectedState> = 'singleSelectedPanelId'
 type ValuesOf<T> = T extends object ? ValuesOfObject<T> : never

 const idk2: ValuesOf<SelectedState> = 'MultipleEntitiesSelected'
 */
