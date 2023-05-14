import { StaticLogger } from './static.logger'
import { routerReducer, RouterReducerState } from '@ngrx/router-store'
import { ActionReducer, ActionReducerMap, MetaReducer } from '@ngrx/store'
import { environment } from '@shared/environment'

export interface GlobalAppState {
	router: RouterReducerState<any>
}

export const reducers: ActionReducerMap<GlobalAppState> = {
	router: routerReducer,
}

const ngrxLogger = new StaticLogger('ngrx')
export const logger =
	(reducer: ActionReducer<any>): ActionReducer<any> =>
	(state, action) => {
		// ngrxLogger.delayedLog('action', action)
		ngrxLogger.debug('action', action)

		return reducer(state, action)
	}

export const metaReducers: MetaReducer<GlobalAppState>[] = !environment.production ? [logger] : []
