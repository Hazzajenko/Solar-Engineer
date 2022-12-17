import { createFeatureSelector, createSelector } from '@ngrx/store'
import * as State from './cable.reducer'
import { selectRouteParams } from '../../../store/router.selectors'

export const selectCablesState = createFeatureSelector<State.CableState>('cables')

export const selectCablesEntities = createSelector(selectCablesState, State.selectEntities)

export const selectAllCables = createSelector(selectCablesState, State.selectAll)

export const selectCablesByProjectIdRouteParams = createSelector(
  selectAllCables,
  selectRouteParams,
  (cables, { projectId }) => cables.filter((cable) => cable.project_id === Number(projectId)),
)
