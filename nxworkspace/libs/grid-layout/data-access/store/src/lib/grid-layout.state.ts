/*

import { ActionReducer, ActionReducerMap, MetaReducer } from '@ngrx/store'
import * as fromGridStore from '@grid-layout/data-access/store'
import { AppState } from '@shared/data-access/store'


export interface GridLayoutState {
  // projects: fromGridStore.ProjectState
  grid: fromGridStore.GridState
  selected: fromGridStore.SelectedState
  links: fromGridStore.LinksState
  multi: fromGridStore.MultiState
  blocks: fromGridStore.BlocksState
}

export const gridReducers: ActionReducerMap<GridLayoutState> = {
  // projects: fromGridStore.projectsReducer,
  grid: fromGridStore.gridReducer,
  selected: fromGridStore.selectedReducer,
  links: fromGridStore.linksReducer,
  multi: fromGridStore.multiReducer,
  blocks: fromGridStore.blocksReducer,
}

/!*export const logger =
  (reducer: ActionReducer<any>): ActionReducer<any> =>
    (state, action) => {
      console.log('state before: ', state)
      console.log('action', action)

      return reducer(state, action)
    }

export const metaReducers: MetaReducer<GridLayoutState>[] = [logger]*!/
// export const metaReducers: MetaReducer<AppState>[] = !environment.production ? [logger] : []
*/
