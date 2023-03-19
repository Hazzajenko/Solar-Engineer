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
/*const iLogObjLogger: Logger2<ILogObj> = new Logger2()
const IStackFrameLogger: Logger2<IStackFrame> = new Logger2()
// pretty output
const defaultPrettyLogger = new Logger2();

// also pretty output
const prettyLogger = new Logger2({ type: "pretty" });

// JSON output
const jsonLogger = new Logger2({ type: "json" });

// hidden output
const hiddenLogger = new Logger2({ type: "hidden" });*/
/*logger.info(source, ...objects)
logger.silly(source, ...objects)

const logger2: Logger<IStackFrame> = new Logger()
logger2.info(source, ...objects)
logger2.silly(source, ...objects)

const logger3: Logger<IErrorObject> = new Logger()
logger3.info(source, ...objects)
logger3.silly(source, ...objects)*/
// const log: Logger()
// storeLogger()
export const logger =
  (reducer: ActionReducer<any>): ActionReducer<any> =>
  (state, action) => {
    // ngrxLogger.debug('state before: ', state)
    ngrxLogger.debug('action', action)
    // iLogObjLogger.debug('state before: ', state)
    /*      iLogObjLogger.debug('action', action)
            // IStackFrameLogger.debug('state before: ', state)
            IStackFrameLogger.debug('action', action)
            defaultPrettyLogger.debug('action', action)
            prettyLogger.debug('action', action)
            jsonLogger.debug('action', action)
            hiddenLogger.debug('action', action)*/

    return reducer(state, action)
  }

// export const metaReducers: MetaReducer<AppState>[] = [logger]
export const metaReducers: MetaReducer<AppState>[] = !environment.production ? [logger] : []
