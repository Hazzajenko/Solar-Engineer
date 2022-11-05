import { createAction, props } from '@ngrx/store';
import { StringPanelModel } from '../../projects-models/string-panel.model';

export const addStringPanel = createAction(
  '[StringPanels Service] Add StringPanel',
  props<{ stringPanel: StringPanelModel }>()
);

export const addStringPanels = createAction(
  '[StringPanels Service] Add StringPanels',
  props<{ stringPanels: StringPanelModel[] }>()
);
