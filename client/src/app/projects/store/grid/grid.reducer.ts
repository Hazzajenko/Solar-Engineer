import { createReducer, on } from '@ngrx/store'
import { CreateMode, GridStateActions } from './grid.actions'
import { StringModel } from '../../models/string.model'
import { GridMode } from './grid-mode.model'

export interface GridState {
  strings: StringModel[]
  selected?: StringModel
  createMode: CreateMode
  gridMode: GridMode
}

export const initialGridState: GridState = {
  strings: [],
  selected: undefined,
  createMode: CreateMode.PANEL,
  gridMode: GridMode.CREATE,
}

export const gridReducer = createReducer(
  initialGridState,

  on(GridStateActions.selectStringForGrid, (state, action) => ({
    strings: state.strings,
    selected: action.string,
    createMode: state.createMode,
    gridMode: state.gridMode,
  })),

  on(GridStateActions.selectTrackerStringsForGrid, (state, action) => ({
    strings: action.strings,
    selected: undefined,
    createMode: state.createMode,
    gridMode: state.gridMode,
  })),

  on(GridStateActions.selectInverterStringsForGrid, (state, action) => ({
    strings: action.strings,
    selected: undefined,
    createMode: state.createMode,
    gridMode: state.gridMode,
  })),

  on(GridStateActions.selectPanelCreateMode, (state, action) => ({
    createMode: action.mode,
    selected: state.selected,
    strings: state.strings,
    gridMode: state.gridMode,
  })),

  on(GridStateActions.selectCableCreateMode, (state, action) => ({
    createMode: action.mode,
    selected: state.selected,
    strings: state.strings,
    gridMode: state.gridMode,
  })),

  on(GridStateActions.clearGridState, (state) => ({
    strings: [],
    selected: undefined,
    createMode: state.createMode,
    gridMode: GridMode.CREATE,
  })),

  on(GridStateActions.selectGridmodeCreate, (state, action) => ({
    strings: state.strings,
    selected: state.selected,
    createMode: state.createMode,
    gridMode: action.mode,
  })),

  on(GridStateActions.selectGridmodeDelete, (state, action) => ({
    strings: state.strings,
    selected: state.selected,
    createMode: state.createMode,
    gridMode: action.mode,
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
