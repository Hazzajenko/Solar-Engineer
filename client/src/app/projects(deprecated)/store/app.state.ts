import { routerReducer, RouterReducerState } from '@ngrx/router-store'
import { ActionReducer, ActionReducerMap, MetaReducer } from '@ngrx/store'
import { environment } from '../../environments/environment'
import * as fromAuth from '../auth/store/auth.reducer'
import * as fromProjects from '../projects(deprecated)/project-id/services/store/projects/projects.reducer'
import * as fromUserProjects from '../projects(deprecated)/store(deprecated)/user-projects/user-projects.reducer'
import * as fromGrid from '../projects(deprecated)/project-id/services/store/grid/grid.reducer'
import * as fromSelected from '../projects(deprecated)/project-id/services/store/selected/selected.reducer'
import * as fromLinks from '../projects(deprecated)/project-id/services/store/links/links.reducer'
import * as fromMulti from '../projects(deprecated)/project-id/services/store/multi-create/multi.reducer'
import * as fromCables from '../projects(deprecated)/store(deprecated)/cable/cable.reducer'
import * as fromBlocks from '../projects(deprecated)/project-id/services/store/blocks/blocks.reducer'
import * as fromInverters from '../projects(deprecated)/store(deprecated)/inverters/inverters.reducer'
import * as fromTrackers from '../projects(deprecated)/store(deprecated)/trackers/trackers.reducer'
import * as fromStrings from '../projects(deprecated)/store(deprecated)/strings/strings.reducer'
import * as fromStringPanels from '../projects(deprecated)/store(deprecated)/string-panels/string-panels.reducer'
import * as fromPanels from '../projects(deprecated)/project-id/services/store/panels/panels.reducer'

export interface AppState {
  auth: fromAuth.AuthState
  projects: fromProjects.ProjectState
  userProjects: fromUserProjects.UserProjectState
  grid: fromGrid.GridState
  selected: fromSelected.SelectedState
  links: fromLinks.LinksState
  multi: fromMulti.MultiState
  cables: fromCables.CableState
  blocks: fromBlocks.BlocksState
  inverters: fromInverters.InverterState
  trackers: fromTrackers.TrackerState
  strings: fromStrings.StringState
  stringPanels: fromStringPanels.StringPanelState
  panels: fromPanels.PanelState
  router: RouterReducerState<any>
}

export const reducers: ActionReducerMap<AppState> = {
  auth: fromAuth.authReducer,
  projects: fromProjects.projectsReducer,
  userProjects: fromUserProjects.userProjectsReducer,
  grid: fromGrid.gridReducer,
  selected: fromSelected.selectedReducer,
  links: fromLinks.linksReducer,
  multi: fromMulti.multiReducer,
  cables: fromCables.cableReducer,
  blocks: fromBlocks.blocksReducer,
  inverters: fromInverters.invertersReducer,
  trackers: fromTrackers.trackersReducer,
  strings: fromStrings.stringsReducer,
  stringPanels: fromStringPanels.stringPanelsReducer,
  panels: fromPanels.panelsReducer,
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
