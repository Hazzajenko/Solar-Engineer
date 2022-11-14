import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity'
import { createReducer, on } from '@ngrx/store'
import * as StringsActions from './strings.actions'
import { StringModel } from '../../models/string.model'

export const selectStringId = (b: StringModel): number => b.id
export const sortByStringName = (a: StringModel, b: StringModel): number =>
  a.name.localeCompare(b.name)

export const stringAdapter: EntityAdapter<StringModel> =
  createEntityAdapter<StringModel>({
    selectId: selectStringId,
    sortComparer: sortByStringName,
  })

export const initialStringsState: StringState = stringAdapter.getInitialState({
  selectedStringId: undefined,
})

export const stringsReducer = createReducer(
  initialStringsState,

  on(StringsActions.addString, (state, { stringModel }) =>
    stringAdapter.addOne(stringModel, state),
  ),

  on(StringsActions.addStringsByProjectId, (state, { stringModels }) =>
    stringAdapter.addMany(stringModels, state),
  ),

  on(StringsActions.updateString, (state, { string }) =>
    stringAdapter.updateOne(
      {
        id: string.id,
        changes: string,
      },
      state,
    ),
  ),

  on(StringsActions.selectString, (state, { string }) => {
    return { ...state, selectedStringId: string.id }
  }),

  on(StringsActions.updateStringTotals, (state, { strings }) =>
    stringAdapter.updateMany(strings, state),
  ),

  on(StringsActions.deleteString, (state, { stringId }) =>
    stringAdapter.removeOne(stringId, state),
  ),
)

export const { selectIds, selectEntities, selectAll } =
  stringAdapter.getSelectors()

// export type StringState = EntityState<StringModel>

export interface StringState extends EntityState<StringModel> {
  // additional entities state properties
  selectedStringId: number | undefined
}
