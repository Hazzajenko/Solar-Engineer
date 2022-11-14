import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity'
import { createReducer, on } from '@ngrx/store'
import * as GridActions from './grid.actions'
import { StringModel } from '../../models/string.model'

export const gridAdapter: EntityAdapter<StringModel> =
  createEntityAdapter<StringModel>()

export const initialGridState: GridState = gridAdapter.getInitialState({})

export const gridReducer = createReducer(
  initialGridState,

  on(GridActions.selectStringForGrid, (state, { string }) =>
    gridAdapter.addOne(string, state),
  ),

  on(GridActions.selectTrackerStringsForGrid, (state, { strings }) =>
    gridAdapter.addMany(strings, state),
  ),

  on(GridActions.selectInverterStringsForGrid, (state, { strings }) =>
    gridAdapter.addMany(strings, state),
  ),

  on(GridActions.clearGridState, (state) => gridAdapter.removeAll(state)),
)

export const { selectIds, selectEntities, selectAll } =
  gridAdapter.getSelectors()

export interface GridState extends EntityState<StringModel> {}
