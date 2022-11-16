import { createReducer, on } from '@ngrx/store'
import { CreateMode, GridStateActions } from './grid.actions'
import { StringModel } from '../../models/string.model'
import { BlockModel } from '../../models/block.model'

export interface GridState {
  strings: StringModel[]
  selected?: StringModel
  createMode: CreateMode
  blocks: BlockModel[]
}

export const initialGridState: GridState = {
  strings: [],
  selected: undefined,
  createMode: CreateMode.PANEL,
  blocks: [],
}

export const gridReducer = createReducer(
  initialGridState,

  on(GridStateActions.selectStringForGrid, (state, action) => ({
    strings: state.strings,
    selected: action.string,
    createMode: state.createMode,
    blocks: state.blocks,
  })),

  on(GridStateActions.selectTrackerStringsForGrid, (state, action) => ({
    strings: action.strings,
    selected: undefined,
    createMode: state.createMode,
    blocks: state.blocks,
  })),

  on(GridStateActions.selectInverterStringsForGrid, (state, action) => ({
    strings: action.strings,
    selected: undefined,
    createMode: state.createMode,
    blocks: state.blocks,
  })),

  on(GridStateActions.selectPanelCreateMode, (state, action) => ({
    createMode: action.mode,
    selected: state.selected,
    strings: state.strings,
    blocks: state.blocks,
  })),

  on(GridStateActions.selectCableCreateMode, (state, action) => ({
    createMode: action.mode,
    selected: state.selected,
    strings: state.strings,
    blocks: state.blocks,
  })),

  on(GridStateActions.addBlockForGrid, (state, action) => ({
    createMode: state.createMode,
    selected: state.selected,
    strings: state.strings,
    blocks: [...state.blocks, action.block],
  })),

  on(GridStateActions.addManyBlocksForGrid, (state, action) => ({
    createMode: state.createMode,
    selected: state.selected,
    strings: state.strings,
    blocks: [...state.blocks, ...action.blocks],
  })),

  on(GridStateActions.updateBlockForGrid, (state, action) => {
    return {
      createMode: state.createMode,
      selected: state.selected,
      strings: state.strings,
      blocks: [
        ...state.blocks,
        state.blocks.map((block) => {
          // block.id !== action.block.id ? block : block === action.block
          if (block.id === action.block.id) {
            const update: BlockModel = {
              id: action.block.id,
              project_id: action.block.project_id,
              location: action.block.location,
              model: action.block.model,
            }
            return update
          }
          return block
        }),
      ],
    }
  }),

  on(GridStateActions.clearGridState, (state) => ({
    strings: [],
    selected: undefined,
    createMode: state.createMode,
    blocks: state.blocks,
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
