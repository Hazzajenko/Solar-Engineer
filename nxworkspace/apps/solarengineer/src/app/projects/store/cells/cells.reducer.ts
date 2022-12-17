import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity'
import { createReducer, on } from '@ngrx/store'
import { CellsStateActions } from './cells.actions'

export interface CellModel {
  project_id: number
  location: string
}

export const selectCell = (b: string): string => b

export const cellAdapter: EntityAdapter<string> = createEntityAdapter<string>({
  selectId: selectCell,
})

export const initialCellsState = cellAdapter.getInitialState({})

export const cellsReducer = createReducer(
  initialCellsState,

  on(CellsStateActions.addItemToCellStore, (state, { location }) =>
    cellAdapter.addOne(location, state),
  ),

  on(CellsStateActions.removeItemToCellStore, (state, { location }) =>
    cellAdapter.removeOne(location, state),
  ),

  on(CellsStateActions.updateItemInCellStore, (state, { oldLocation, newLocation }) =>
    cellAdapter.updateOne(
      {
        id: oldLocation,
        changes: newLocation,
      },
      state,
    ),
  ),

  on(CellsStateActions.addManyItemsToCellStore, (state, { locations }) =>
    cellAdapter.addMany(locations, state),
  ),

  on(CellsStateActions.removeManyItemsToCellStore, (state, { locations }) =>
    cellAdapter.removeMany(locations, state),
  ),

  on(CellsStateActions.clearCellsState, (state) => cellAdapter.removeAll(state)),
)

export const { selectIds, selectEntities, selectAll } = cellAdapter.getSelectors()

export type CellsState = EntityState<string>
