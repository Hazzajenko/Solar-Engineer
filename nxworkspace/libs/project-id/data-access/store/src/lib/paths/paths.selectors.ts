import { createFeatureSelector, createSelector } from '@ngrx/store'
import { PanelLinkPathModel, StringModel } from '@shared/data-access/models'
import { selectRouteParams } from '@shared/data-access/router'
import { STRINGS_FEATURE_KEY, stringsAdapter, StringsState } from 'libs/project-id/data-access/store/src/lib/strings'
import { PATHS_FEATURE_KEY, pathsAdapter, PathsState } from './paths.reducer'

export const selectPathMapsState = createFeatureSelector<PathsState>(PATHS_FEATURE_KEY)

const { selectAll, selectEntities } = pathsAdapter.getSelectors()

export const selectPathsLoaded = createSelector(
  selectPathMapsState,
  (state: PathsState) => state.loaded,
)

export const selectPathsError = createSelector(
  selectPathMapsState,
  (state: PathsState) => state.error,
)

export const selectAllPaths = createSelector(selectPathMapsState, (state: PathsState) =>
  selectAll(state),
)

export const selectPathsEntities = createSelector(selectPathMapsState, (state: PathsState) =>
  selectEntities(state),
)

export const selectPathsByRouteParams = createSelector(
  selectAllPaths,
  selectRouteParams,
  (paths, { projectId }) => paths.filter((path) => path.projectId === Number(projectId)),
)

export const selectPathsById = (props: { pathId: string }) =>
  createSelector(selectAllPaths, (paths: PanelLinkPathModel[]) =>
    paths.find((path) => path.id === props.pathId),
  )

export const selectPathByPanelId = (props: { panelId: string }) =>
  createSelector(selectAllPaths, (paths: PanelLinkPathModel[]) =>
    paths.find((path) => path.id === props.panelId),
  )

export const selectPathsByStringId = (props: { stringId: string }) =>
  createSelector(selectAllPaths, (paths: PanelLinkPathModel[]) =>
    paths.find((path) => path.stringId === props.stringId),
  )

export const selectPathsByColor = (props: { color: string }) =>
  createSelector(selectAllPaths, (paths: PanelLinkPathModel[]) =>
    paths.find((path) => path.path.color === props.color),
  )