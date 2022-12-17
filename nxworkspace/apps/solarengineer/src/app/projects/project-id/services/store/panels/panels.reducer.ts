import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity'
import { createReducer, on } from '@ngrx/store'
import { PanelStateActions } from './panels.actions'
import { PanelModel } from '../../../../../../../../../libs/shared/data-access/models/src/lib/panel.model'

export const selectPanelId = (b: PanelModel): string => b.id

export const panelAdapter: EntityAdapter<PanelModel> = createEntityAdapter<PanelModel>({
  selectId: selectPanelId,
})

export const initialPanelsState = panelAdapter.getInitialState({})

export const panelsReducer = createReducer(
  initialPanelsState,

  on(PanelStateActions.addPanel, (state, { panel }) => panelAdapter.addOne(panel, state)),

  on(PanelStateActions.addManyPanels, (state, { panels }) => panelAdapter.addMany(panels, state)),

  on(PanelStateActions.updatePanel, (state, { panel }) =>
    panelAdapter.updateOne(
      {
        id: panel.id!,
        changes: panel,
      },
      state,
    ),
  ),

  on(PanelStateActions.updateManyPanels, (state, { panels }) =>
    panelAdapter.updateMany(panels, state),
  ),

  on(PanelStateActions.deletePanel, (state, { panelId }) => panelAdapter.removeOne(panelId, state)),

  on(PanelStateActions.deleteManyPanels, (state, { panelIds }) =>
    panelAdapter.removeMany(panelIds, state),
  ),
)

export const { selectIds, selectEntities, selectAll } = panelAdapter.getSelectors()

export type PanelState = EntityState<PanelModel>
