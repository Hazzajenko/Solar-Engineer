import { createFeatureSelector, createSelector } from '@ngrx/store'
import * as State from './cells.reducer'

export const selectCellsState = createFeatureSelector<State.CellsState>('cells')

export const selectCellsEntities = createSelector(
  selectCellsState,
  State.selectEntities,
)

export const selectAllCells = createSelector(selectCellsState, State.selectAll)

/*
export const selectCellsByProjectIdRouteParams = createSelector(
  selectAllCells,
  selectRouteParams,
  (cells, { projectId }) =>
    panels.filter((panel) => panel.project_id === Number(projectId)),
)

export const selectCellsByProjectId = (props: { projectId: number }) =>
  createSelector(selectAllCells, (blocks: BlockModel[]) =>
    blocks.filter((block) => block.project_id === Number(props.projectId)),
  )
*/
