import { createFeatureSelector, createSelector } from '@ngrx/store'
import { BlockModel } from '@shared/data-access/models'
import { selectRouteParams } from '@shared/data-access/store'
import {
  ENTITIES_FEATURE_KEY,
  entitiesAdapter,
  EntitiesState,
} from 'libs/project-id/data-access/store/src/lib/entities/entities.reducer'

export const selectBlocksState = createFeatureSelector<EntitiesState>(ENTITIES_FEATURE_KEY)

const { selectAll, selectEntities } = entitiesAdapter.getSelectors()

export const selectBlocksLoaded = createSelector(
  selectBlocksState,
  (state: EntitiesState) => state.loaded,
)

export const selectBlocksError = createSelector(
  selectBlocksState,
  (state: EntitiesState) => state.error,
)

export const selectAllBlocks = createSelector(selectBlocksState, (state: EntitiesState) =>
  selectAll(state),
)

export const selectBlocksEntities = createSelector(selectBlocksState, (state: EntitiesState) =>
  selectEntities(state),
)

export const selectBlockByLocation = (props: { location: string }) =>
  createSelector(selectAllBlocks, (blocks: BlockModel[]) =>
    blocks.find((block) => block.location === props.location),
  )
export const selectBlocksByProjectIdRouteParams = createSelector(
  selectAllBlocks,
  selectRouteParams,
  (blocks, { projectId }) => {
    if (blocks) {
      return blocks.filter((block) => block.projectId === Number(projectId))
    }
    return []
  },
)
