import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { createReducer, on } from '@ngrx/store';
import * as PanelsActions from './panels.actions';
import { PanelModel } from '../../models/panel.model';

export const selectPanelId = (b: PanelModel): number => b.id;

export const panelAdapter: EntityAdapter<PanelModel> =
  createEntityAdapter<PanelModel>({
    selectId: selectPanelId,
  });

export const initialPanelsState = panelAdapter.getInitialState({});

export const panelsReducer = createReducer(
  initialPanelsState,

  on(PanelsActions.addPanel, (state, { panel }) =>
    panelAdapter.addOne(panel, state)
  ),

  on(PanelsActions.addPanelsByProjectId, (state, { panels }) =>
    panelAdapter.addMany(panels, state)
  )
);

export const { selectIds, selectEntities, selectAll } =
  panelAdapter.getSelectors();

export type PanelState = EntityState<PanelModel>;
