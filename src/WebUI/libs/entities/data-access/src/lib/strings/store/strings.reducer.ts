import { StringsActions } from './strings.actions'
import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity'
import { Action, createReducer, on } from '@ngrx/store'
import { StringId, StringModel, UNDEFINED_STRING_NAME } from '@entities/shared'
import { newGuid, newGuidT } from '@shared/utils'

export const STRINGS_FEATURE_KEY = 'strings'

export interface StringsState extends EntityState<StringModel> {
	undefinedStringId: StringId | undefined
	loaded: boolean
	error?: string | null
}

export const stringsAdapter: EntityAdapter<StringModel> = createEntityAdapter<StringModel>({
	selectId: (string) => string.id,
})

const undefinedStringId = newGuidT<StringId>()

export const initialStringsState: StringsState = stringsAdapter.getInitialState({
	undefinedStringId,
	ids: [undefinedStringId],
	entities: {
		[undefinedStringId]: {
			id: undefinedStringId,
			name: UNDEFINED_STRING_NAME,
			type: 'String',
			colour: '#000000',
			disconnectionPointId: newGuid(),
			parallel: false,
		},
	},
	loaded: false,
})

const reducer = createReducer(
	initialStringsState,
	on(StringsActions.loadStrings, (state, { strings }) => {
		const newState = stringsAdapter.upsertMany(strings, state)
		const undefinedStringId = strings.find((string) => string.name === UNDEFINED_STRING_NAME)?.id
		if (!undefinedStringId) {
			throw new Error('Undefined string not found')
		}
		return { ...newState, undefinedStringId, loaded: true }
	}),
	on(StringsActions.addString, (state, { string }) => stringsAdapter.addOne(string, state)),
	on(StringsActions.addStringWithPanels, (state, { string }) =>
		stringsAdapter.addOne(string, state),
	),
	on(StringsActions.addManyStrings, (state, { strings }) => stringsAdapter.addMany(strings, state)),
	on(StringsActions.updateString, (state, { update }) => stringsAdapter.updateOne(update, state)),
	on(StringsActions.updateManyStrings, (state, { updates }) =>
		stringsAdapter.updateMany(updates, state),
	),
	on(StringsActions.deleteString, (state, { stringId }) =>
		stringsAdapter.removeOne(stringId, state),
	),
	on(StringsActions.deleteManyStrings, (state, { stringIds }) =>
		stringsAdapter.removeMany(stringIds, state),
	),
	on(StringsActions.addStringNoSignalr, (state, { string }) =>
		stringsAdapter.addOne(string, state),
	),
	on(StringsActions.addManyStringsNoSignalr, (state, { strings }) =>
		stringsAdapter.addMany(strings, state),
	),
	on(StringsActions.updateStringNoSignalr, (state, { update }) =>
		stringsAdapter.updateOne(update, state),
	),
	on(StringsActions.updateManyStringsNoSignalr, (state, { updates }) =>
		stringsAdapter.updateMany(updates, state),
	),
	on(StringsActions.deleteStringNoSignalr, (state, { stringId }) =>
		stringsAdapter.removeOne(stringId, state),
	),
	on(StringsActions.deleteManyStringsNoSignalr, (state, { stringIds }) =>
		stringsAdapter.removeMany(stringIds, state),
	),
	on(StringsActions.clearStringsState, () => initialStringsState),
)

export function stringsReducer(state: StringsState | undefined, action: Action) {
	return reducer(state, action)
}

/*

 export function injectStringsFeature() {
 const store = inject(Store)
 const allStrings = store.selectSignal(selectAllStrings)
 const entities = store.selectSignal(selectStringsEntities)

 return {
 get allStrings() {
 return allStrings
 },
 getById(id: string) {
 return entities()[id]
 },
 getByIds(ids: string[]) {
 return ids.map((id) => entities()[id]).filter(isNotNull)
 } /!*		allStringsWithPanels() {
 return store.selectSignal(selectAllStringsWithPanels)
 },*!/,
 addString(string: CanvasString) {
 store.dispatch(StringsActions.addString({ string }))
 },
 addManyStrings(strings: CanvasString[]) {
 store.dispatch(StringsActions.addManyStrings({ strings }))
 },
 updateString(update: UpdateStr<CanvasString>) {
 store.dispatch(StringsActions.updateString({ update }))
 },
 updateManyStrings(updates: UpdateStr<CanvasString>[]) {
 store.dispatch(StringsActions.updateManyStrings({ updates }))
 },
 deleteString(id: string) {
 store.dispatch(StringsActions.deleteString({ stringId: id }))
 },
 deleteManyStrings(ids: string[]) {
 store.dispatch(StringsActions.deleteManyStrings({ stringIds: ids }))
 },
 clearStringsState() {
 store.dispatch(StringsActions.clearStringsState())
 },
 }
 }

 export type StringsFeature = ReturnType<typeof injectStringsFeature>
 */
