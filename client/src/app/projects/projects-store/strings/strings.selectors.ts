import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as State from './strings.reducer';
import { selectRouteParams } from '../../../store/router.selectors';

export const selectStringsState =
  createFeatureSelector<State.StringState>('strings');

export const selectStringEntities = createSelector(
  selectStringsState,
  State.selectEntities
);

export const selectAllStrings = createSelector(
  selectStringsState,
  State.selectAll
);

export const selectStringByRouteParams = createSelector(
  selectStringEntities,
  selectRouteParams,
  (stringModels, { stringModelId }) => stringModels[stringModelId]
);

export const selectStringsByTrackerIdRouteParams = createSelector(
  selectAllStrings,
  selectRouteParams,
  (stringModels, { trackerId }) =>
    stringModels.filter(
      (stringModel) => stringModel.trackerId === Number(trackerId)
    )
);
