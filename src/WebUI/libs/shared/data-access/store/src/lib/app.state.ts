import { routerReducer, RouterReducerState } from '@ngrx/router-store'
import { ActionReducer, ActionReducerMap, MetaReducer } from '@ngrx/store'
import { environment } from '@shared/environment'
import { Logger } from './static.logger'
// import { Logger } from '@ngrx/data'

// import { Logger } from './static.logger'

export interface AppState {
  // auth: fromAuthStore.AuthState
  router: RouterReducerState<any>
}

export const reducers: ActionReducerMap<AppState> = {
  // auth: fromAuthStore.chatroomsReducer,
  router: routerReducer,
}

// const fileName = __filename.slice(__dirname.length + 1)
const ngrxLogger = new Logger('ngrx')
// const log: Logger()
// storeLogger()
export const logger =
  (reducer: ActionReducer<any>): ActionReducer<any> =>
    (state, action) => {
      ngrxLogger.debug('state before: ', state)
      ngrxLogger.debug('action', action)

      return reducer(state, action)
    }

// export const metaReducers: MetaReducer<AppState>[] = [logger]
export const metaReducers: MetaReducer<AppState>[] = !environment.production ? [logger] : []
