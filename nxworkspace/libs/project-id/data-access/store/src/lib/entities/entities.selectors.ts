import { createFeatureSelector, createSelector } from '@ngrx/store'
import { selectRouteParams } from '@shared/data-access/router'
import { ENTITIES_FEATURE_KEY, entitiesAdapter, EntitiesState } from './entities.reducer'

export const selectEntitiesState = createFeatureSelector<EntitiesState>(ENTITIES_FEATURE_KEY)

const { selectAll, selectEntities } = entitiesAdapter.getSelectors()

export const selectEntitiesLoaded = createSelector(
  selectEntitiesState,
  (state: EntitiesState) => state.loaded,
)

export const selectEntitiesError = createSelector(
  selectEntitiesState,
  (state: EntitiesState) => state.error,
)

export const selectAllEntities = createSelector(selectEntitiesState, (state: EntitiesState) =>
  selectAll(state),
)

export const selectEntitiesEntities = createSelector(selectEntitiesState, (state: EntitiesState) =>
  selectEntities(state),
)

export const selectEntitiesByProjectIdRouteParams = createSelector(
  selectAllEntities,
  selectRouteParams,
  (entities, { projectId }) => {
    if (entities) {
      return entities.filter((entity) => entity.projectId === Number(projectId))
    }
    return []
  },
)
