import { createFeatureSelector, createSelector } from '@ngrx/store'
import * as State from './strings.reducer'
import { selectRouteParams } from '../../../store/router.selectors'
import { StringModel } from '../../models/string.model'

export const selectStringsState =
  createFeatureSelector<State.StringState>('strings')

export const selectStringEntities = createSelector(
  selectStringsState,
  State.selectEntities,
)

export const selectAllStrings = createSelector(
  selectStringsState,
  State.selectAll,
)

export const selectSelectedStringId = createSelector(
  selectStringsState,
  (state) => state.selectedStringId,
)

export const selectStringByRouteParams = createSelector(
  selectStringEntities,
  selectRouteParams,
  (stringModels, { stringModelId }) => stringModels[stringModelId],
)

export const selectStringsByTrackerIdRouteParams = createSelector(
  selectAllStrings,
  selectRouteParams,
  (stringModels, { trackerId }) =>
    stringModels.filter(
      (stringModel) => stringModel.trackerId === Number(trackerId),
    ),
)

export const selectStringsByProjectId = (props: { projectId: number }) =>
  createSelector(selectAllStrings, (stringModels: StringModel[]) =>
    stringModels.filter(
      (stringModel) => stringModel.projectId === Number(props.projectId),
    ),
  )

export const selectStringsByTrackerId = (props: { trackerId: number }) =>
  createSelector(selectAllStrings, (stringModels: StringModel[]) =>
    stringModels.filter(
      (stringModel) => stringModel.trackerId === props.trackerId,
    ),
  )

export const selectStringById = (props: { id: number }) =>
  createSelector(selectAllStrings, (strings: StringModel[]) =>
    strings.find((string) => string.id === props.id),
  )
