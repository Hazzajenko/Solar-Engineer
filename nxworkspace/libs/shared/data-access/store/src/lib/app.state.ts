import { routerReducer, RouterReducerState } from '@ngrx/router-store'
import { ActionReducer, ActionReducerMap, MetaReducer } from '@ngrx/store'
import * as fromGridStore from '@grid-layout/data-access/store'
import * as fromAuthStore from '@auth/data-access/store'


export interface AppState {
  auth: fromAuthStore.AuthState
  router: RouterReducerState<any>
  grid: fromGridStore.GridState
  selected: fromGridStore.SelectedState
  links: fromGridStore.LinksState
  multi: fromGridStore.MultiState
  blocks: fromGridStore.BlocksState

}

export const reducers: ActionReducerMap<AppState> = {
  auth: fromAuthStore.authReducer,
  router: routerReducer,
  grid: fromGridStore.gridReducer,
  selected: fromGridStore.selectedReducer,
  links: fromGridStore.linksReducer,
  multi: fromGridStore.multiReducer,
  blocks: fromGridStore.blocksReducer,

}

export const logger =
  (reducer: ActionReducer<any>): ActionReducer<any> =>
  (state, action) => {
    console.log('state before: ', state)
    console.log('action', action)

    return reducer(state, action)
  }

export const metaReducers: MetaReducer<AppState>[] = [logger]
// export const metaReducers: MetaReducer<AppState>[] = !environment.production ? [logger] : []
