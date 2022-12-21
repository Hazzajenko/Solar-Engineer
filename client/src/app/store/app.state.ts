import { routerReducer, RouterReducerState } from '@ngrx/router-store'
import { ActionReducer, ActionReducerMap, MetaReducer } from '@ngrx/store'
import { environment } from '../../environments/environment'
import * as fromAuth from '../auth/store/auth.reducer'


export interface AppState {
  auth: fromAuth.AuthState
  router: RouterReducerState<any>
}

export const reducers: ActionReducerMap<AppState> = {
  auth: fromAuth.authReducer,
  router: routerReducer,
}

export const logger =
  (reducer: ActionReducer<any>): ActionReducer<any> =>
  (state, action) => {
    console.log('state before: ', state)
    console.log('action', action)

    return reducer(state, action)
  }

export const metaReducers: MetaReducer<AppState>[] = !environment.production ? [logger] : []
