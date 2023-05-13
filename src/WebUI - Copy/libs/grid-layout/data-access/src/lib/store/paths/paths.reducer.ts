import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity'
import { Action, createReducer, on } from '@ngrx/store'
import { SelectedPanelLinkPathModel, PathModel } from '@shared/data-access/models'
import { PathsActions } from './paths.actions'

export const PATHS_FEATURE_KEY = 'paths'

export interface PathsState extends EntityState<PathModel> {
  selectedPanelLinkPath?: SelectedPanelLinkPathModel
  loaded: boolean
  error?: string | null
}

export const pathsAdapter: EntityAdapter<PathModel> = createEntityAdapter<PathModel>()

export const initialPathsState: PathsState = pathsAdapter.getInitialState({
  loaded: false,
})

const reducer = createReducer(
  initialPathsState,
  on(PathsActions.initPaths, (state) => ({ ...state, loaded: false, error: null })),
  on(PathsActions.loadPathsSuccess, (state, { paths }) =>
    pathsAdapter.setAll(paths, { ...state, loaded: true }),
  ),
  on(PathsActions.loadPathsFailure, (state, { error }) => ({ ...state, error })),
  on(PathsActions.addPath, (state, { path }) => pathsAdapter.addOne(path, state)),
  on(PathsActions.addManyPaths, (state, { paths }) => pathsAdapter.addMany(paths, state)),

  on(PathsActions.updatePath, (state, { update }) => pathsAdapter.updateOne(update, state)),

  on(PathsActions.deletePath, (state, { pathId }) => pathsAdapter.removeOne(pathId, state)),
  on(PathsActions.setSelectedPanelLinkPaths, (state, { selectedPanelLinkPath }) => ({
    ...state,
    selectedPanelLinkPath,
  })),
  on(PathsActions.clearSelectedPanelLinkPaths, (state) => ({
    ...state,
    selectedPanelLinkPath: undefined,
  })),
)

export function pathsReducer(state: PathsState | undefined, action: Action) {
  return reducer(state, action)
}
