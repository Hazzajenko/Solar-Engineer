import { createAction, props } from '@ngrx/store';
import { PanelModel } from '../../models/panel.model';

export const addPanel = createAction(
  '[Panels Service] Add Panel',
  props<{ panel: PanelModel }>()
);

export const addPanelsByProjectId = createAction(
  '[Panels Service] Add Panels',
  props<{ panels: PanelModel[] }>()
);

export const updatePanel = createAction(
  '[Panels Service] Update Panel',
  props<{ panel: PanelModel }>()
);
