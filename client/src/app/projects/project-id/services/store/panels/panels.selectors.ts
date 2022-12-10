import { createFeatureSelector, createSelector } from '@ngrx/store'
import * as State from './panels.reducer'
import { selectRouteParams } from '../../../../../store/router.selectors'
import { PanelModel } from '../../../../models/panel.model'

export const selectPanelsState = createFeatureSelector<State.PanelState>('panels')

export const selectPanelEntities = createSelector(selectPanelsState, State.selectEntities)

export const selectAllPanels = createSelector(selectPanelsState, State.selectAll)

export const selectPanelByRouteParams = createSelector(
  selectPanelEntities,
  selectRouteParams,
  (panels, { panelId }) => panels[panelId],
)
/*
export const selectPanelsByStringIdRouteParams = createSelector(
  selectAllPanels,
  selectRouteParams,
  (panels, { stringId }) =>
    panels.filter((panel) => panel.string_id === Number(stringId)),
)*/

export const selectPanelsByProjectIdRouteParams = createSelector(
  selectAllPanels,
  selectRouteParams,
  (panels, { projectId }) => panels.filter((panel) => panel.projectId === Number(projectId)),
)

export const selectPanelsByProjectId = (props: { projectId: number }) =>
  createSelector(selectAllPanels, (panels: PanelModel[]) =>
    panels.filter((panel) => panel.projectId === Number(props.projectId)),
  )

/*export const selectPanelsByStringId = (props: { stringId: number }) =>
  createSelector(selectAllPanels, (panels: PanelModel[]) =>
    panels.filter((panel) => panel.string_id === props.stringId),
  )*/

/*export const selectPanelsByTrackerId = (props: { trackerId: number }) =>
  createSelector(selectAllPanels, (panels: PanelModel[]) =>
    panels.filter((panel) => panel.tracker_id === props.trackerId),
  )*/

/*
export const selectPanelByLocation = (props: { location: number }) =>
  createSelector(selectAllPanels, (panels: PanelModel[]) =>
    panels.find((panel) => panel.location === props.location),
  )
*/
