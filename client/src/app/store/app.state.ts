import { routerReducer, RouterReducerState } from '@ngrx/router-store';
import { ActionReducer, ActionReducerMap, MetaReducer } from '@ngrx/store';
import { environment } from '../../environments/environment';
import * as fromAuth from '../auth/store/auth.reducer';
import * as fromProjects from '../projects/store/projects/projects.reducer';
import * as fromTreeNodes from '../projects/store/tree-node/tree-node.reducer';
import * as fromUserProjects from '../projects/store/user-projects/user-projects.reducer';
import * as fromInverters from '../projects/store/inverters/inverters.reducer';
import * as fromTrackers from '../projects/store/trackers/trackers.reducer';
import * as fromStrings from '../projects/store/strings/strings.reducer';
import * as fromStringPanels from '../projects/store/string-panels/string-panels.reducer';
import * as fromPanels from '../projects/store/panels/panels.reducer';

export interface AppState {
  auth: fromAuth.AuthState;
  projects: fromProjects.ProjectState;
  tree_nodes: fromTreeNodes.TreeNodeState;
  userProjects: fromUserProjects.UserProjectState;
  inverters: fromInverters.InverterState;
  trackers: fromTrackers.TrackerState;
  strings: fromStrings.StringState;
  stringPanels: fromStringPanels.StringPanelState;
  panels: fromPanels.PanelState;
  router: RouterReducerState<any>;
}

export const reducers: ActionReducerMap<AppState> = {
  auth: fromAuth.authReducer,
  projects: fromProjects.projectsReducer,
  tree_nodes: fromTreeNodes.treeNodeReducer,
  userProjects: fromUserProjects.userProjectsReducer,
  inverters: fromInverters.invertersReducer,
  trackers: fromTrackers.trackersReducer,
  strings: fromStrings.stringsReducer,
  stringPanels: fromStringPanels.stringPanelsReducer,
  panels: fromPanels.panelsReducer,
  router: routerReducer,
};

export const logger =
  (reducer: ActionReducer<any>): ActionReducer<any> =>
  (state, action) => {
    console.log('state before: ', state);
    console.log('action', action);

    return reducer(state, action);
  };

export const metaReducers: MetaReducer<AppState>[] = !environment.production
  ? [logger]
  : [];
