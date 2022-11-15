import { createReducer, on } from '@ngrx/store'
import { CreateMode, GridStateActions } from './grid.actions'
import { StringModel } from '../../models/string.model'

export interface GridState {
  strings?: StringModel[]
  createMode?: CreateMode
}

export const initialGridState: GridState = {
  strings: undefined,
  createMode: undefined,
}

export const gridReducer = createReducer(
  initialGridState,

  on(GridStateActions.selectStringForGrid, (state, action) => ({
    strings: [action.string],
    createMode: state.createMode,
  })),

  on(GridStateActions.selectTrackerStringsForGrid, (state, action) => ({
    strings: action.strings,
    createMode: state.createMode,
  })),

  on(GridStateActions.selectInverterStringsForGrid, (state, action) => ({
    strings: action.strings,
    createMode: state.createMode,
  })),

  on(GridStateActions.selectPanelCreateMode, (state, action) => ({
    createMode: action.mode,
    strings: state.strings,
  })),

  on(GridStateActions.selectCableCreateMode, (state, action) => ({
    createMode: action.mode,
    strings: state.strings,
  })),

  on(GridStateActions.clearGridState, (state, action) => ({
    strings: undefined,
    createMode: state.createMode,
  })),
)

/*export const gridAdapter: EntityAdapter<StringModel> =
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

export interface GridState extends EntityState<StringModel> {}*/
