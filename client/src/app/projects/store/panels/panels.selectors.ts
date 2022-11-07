import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as State from './panels.reducer';
import { selectRouteParams } from '../../../store/router.selectors';
import { PanelModel } from '../../models/panel.model';

export const selectPanelsState =
  createFeatureSelector<State.PanelState>('panels');

export const selectPanelEntities = createSelector(
  selectPanelsState,
  State.selectEntities
);

export const selectAllPanels = createSelector(
  selectPanelsState,
  State.selectAll
);

export const selectPanelByRouteParams = createSelector(
  selectPanelEntities,
  selectRouteParams,
  (panels, { panelId }) => panels[panelId]
);

export const selectPanelsByStringIdRouteParams = createSelector(
  selectAllPanels,
  selectRouteParams,
  (panels, { stringId }) =>
    panels.filter((panel) => panel.stringId === Number(stringId))
);

export const selectPanelsByProjectId = (props: { projectId: number }) =>
  createSelector(selectAllPanels, (panels: PanelModel[]) =>
    panels.filter((panel) => panel.projectId === Number(props.projectId))
  );
