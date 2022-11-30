import { createReducer, on } from '@ngrx/store'
import { GridStateActions } from './grid.actions'
import { StringModel } from '../../../../models/string.model'
import { GridMode } from './grid-mode.model'
import { UnitModel } from '../../../../models/unit.model'
import { PanelModel } from '../../../../models/panel.model'

export interface GridState {
  strings: StringModel[]
  selected?: StringModel
  createMode: UnitModel
  gridMode: GridMode
  toJoin: string[]
  panelToJoin: PanelModel[]
}

export const initialGridState: GridState = {
  strings: [],
  selected: undefined,
  createMode: UnitModel.PANEL,
  gridMode: GridMode.CREATE,
  toJoin: [],
  panelToJoin: [],
}

export const gridReducer = createReducer(
  initialGridState,

  on(GridStateActions.selectStringForGrid, (state, action) => ({
    strings: state.strings,
    selected: action.string,
    createMode: state.createMode,
    gridMode: state.gridMode,
    toJoin: state.toJoin,
    panelToJoin: state.panelToJoin,
  })),

  on(GridStateActions.selectTrackerStringsForGrid, (state, action) => ({
    strings: action.strings,
    selected: undefined,
    createMode: state.createMode,
    gridMode: state.gridMode,
    toJoin: state.toJoin,
    panelToJoin: state.panelToJoin,
  })),

  on(GridStateActions.selectInverterStringsForGrid, (state, action) => ({
    strings: action.strings,
    selected: undefined,
    createMode: state.createMode,
    gridMode: state.gridMode,
    toJoin: state.toJoin,
    panelToJoin: state.panelToJoin,
  })),

  on(GridStateActions.selectCreateMode, (state, action) => ({
    createMode: action.create,
    selected: state.selected,
    strings: state.strings,
    gridMode: state.gridMode,
    toJoin: state.toJoin,
    panelToJoin: state.panelToJoin,
  })),
  /*
    on(GridStateActions.selectCableCreateMode, (state, action) => ({
      createMode: action.mode,
      selected: state.selected,
      strings: state.strings,
      gridMode: state.gridMode,
    })),*/

  on(GridStateActions.clearGridState, (state) => ({
    strings: [],
    selected: undefined,
    createMode: state.createMode,
    gridMode: GridMode.CREATE,
    toJoin: state.toJoin,
    panelToJoin: state.panelToJoin,
  })),

  on(GridStateActions.selectGridmodeCreate, (state, action) => ({
    strings: state.strings,
    selected: state.selected,
    createMode: state.createMode,
    gridMode: action.mode,
    toJoin: state.toJoin,
    panelToJoin: state.panelToJoin,
  })),

  on(GridStateActions.selectGridmodeDelete, (state, action) => ({
    strings: state.strings,
    selected: state.selected,
    createMode: state.createMode,
    gridMode: action.mode,
    toJoin: state.toJoin,
    panelToJoin: state.panelToJoin,
  })),

  on(GridStateActions.selectGridmodeJoin, (state, action) => ({
    strings: state.strings,
    selected: state.selected,
    createMode: state.createMode,
    gridMode: action.mode,
    toJoin: state.toJoin,
    panelToJoin: state.panelToJoin,
  })),

  on(GridStateActions.changeGridmode, (state, action) => ({
    strings: state.strings,
    selected: state.selected,
    createMode: state.createMode,
    gridMode: action.mode,
    toJoin: state.toJoin,
    panelToJoin: state.panelToJoin,
  })),

  on(GridStateActions.addToJoinArray, (state, action) => ({
    strings: state.strings,
    selected: state.selected,
    createMode: state.createMode,
    gridMode: state.gridMode,
    toJoin: [...state.toJoin, action.toJoin],
    panelToJoin: state.panelToJoin,
  })),

  on(GridStateActions.clearJoinArray, (state) => ({
    strings: state.strings,
    selected: state.selected,
    createMode: state.createMode,
    gridMode: state.gridMode,
    toJoin: [],
    panelToJoin: [],
  })),

  on(GridStateActions.addPanelToJoin, (state, action) => ({
    strings: state.strings,
    selected: state.selected,
    createMode: state.createMode,
    gridMode: state.gridMode,
    toJoin: state.toJoin,
    panelToJoin: [...state.panelToJoin, action.panel],
  })),
)

/*export const gridAdapter: EntityAdapter<StringModel> =
  createEntityAdapter<StringModel>()

export const initialGridState: GridState = gridAdapter.getInitialState({})

export const selectedReducer = createReducer(
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
