
import { routerReducer, RouterReducerState } from '@ngrx/router-store'
import { ActionReducer, ActionReducerMap, MetaReducer } from '@ngrx/store'

export interface AppState {
  // auth: fromAuthStore.AuthState
  router: RouterReducerState<any>
}

export const reducers: ActionReducerMap<AppState> = {
  // auth: fromAuthStore.authReducer,
  router: routerReducer,
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
