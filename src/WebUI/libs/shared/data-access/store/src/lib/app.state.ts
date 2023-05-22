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

const mutedActionTypes = [
	'@ngrx/store/init',
	'@ngrx/effects/init',
	'@ngrx/router-store/request',
	'@ngrx/store/update-reducers',
	'@ngrx/store-devtools/recompute',
	'@ngrx/router-store/navigation',
	'@ngrx/router-store/navigated',
	'[App State Store] Set Hovering Over Entity',
	'[App State Store] Lift Hovering Over Entity',
	'[PanelLinks Store] Set Hovering Over Panel Link In App',
	'[PanelLinks Store] Clear Hovering Over Panel Link In App',
]
export const logger =
	(reducer: ActionReducer<any>): ActionReducer<any> =>
	(state, action) => {
		// action.type
		// ngrxLogger.delayedLog('action', action)

		if (!mutedActionTypes.includes(action.type)) {
			ngrxLogger.debug('action', action)
		}

		return reducer(state, action)
	}

export const metaReducers: MetaReducer<GlobalAppState>[] = !environment.production ? [logger] : []
