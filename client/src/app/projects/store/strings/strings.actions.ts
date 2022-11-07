import { createAction, props } from '@ngrx/store';
import { StringModel } from '../../models/string.model';

export const addString = createAction(
  '[Strings Service] Add String',
  props<{ stringModel: StringModel }>()
);

export const addStringsToTracker = createAction(
  '[Strings Service] Add Strings to Tracker',
  props<{ stringModels: StringModel[] }>()
);

export const addStringsByProjectId = createAction(
  '[Strings Service] Add Strings By TrackerId',
  props<{ stringModels: StringModel[] }>()
);
