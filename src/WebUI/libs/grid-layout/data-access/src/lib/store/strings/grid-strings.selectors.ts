import { PanelStringNameColor } from '../../../../../feature/src/lib/feature/block-panel/models/panel-string-name-color'
import { GridStringsState, STRINGS_FEATURE_KEY, stringsAdapter } from './grid-strings.reducer'
import { createFeatureSelector, createSelector } from '@ngrx/store'
import { GridStringModel } from '@shared/data-access/models'
import { RouterSelectors } from '@shared/data-access/router'


export const selectStringsState = createFeatureSelector<GridStringsState>(STRINGS_FEATURE_KEY)

const { selectAll, selectEntities } = stringsAdapter.getSelectors()

export const selectStringsLoaded = createSelector(
  selectStringsState,
  (state: GridStringsState) => state.loaded,
)

export const selectStringsError = createSelector(
  selectStringsState,
  (state: GridStringsState) => state.error,
)

export const selectAllStrings = createSelector(selectStringsState, (state: GridStringsState) =>
  selectAll(state),
)

export const selectStringsEntities = createSelector(selectStringsState, (state: GridStringsState) =>
  selectEntities(state),
)

export const selectAllDefinedStrings = createSelector(selectAllStrings, (strings) =>
  strings.filter((s) => s.name !== undefined && s.name !== null && s.name !== ''),
)

export const selectStringsByRouteParams = createSelector(
  selectAllStrings,
  RouterSelectors.selectRouteParams,
  (strings, { projectId }) =>
    strings.filter((s) => s.projectId === projectId /*Number(projectId)*/),
)

export const selectStringById = (props: { id: string }) =>
  createSelector(selectAllStrings, (strings: GridStringModel[]) =>
    strings.find((string) => string.id === props.id),
  )

export const selectStringNameAndColorById = (props: { id: string }) =>
  createSelector(selectAllStrings, (strings: GridStringModel[]) => {
    const string = strings.find((string) => string.id === props.id)
    return { stringName: string?.name, stringColor: string?.color } as PanelStringNameColor
  })

/*
 export const selectPanelPathRecordByStringId = (props: { stringId: string }) =>
 createSelector(
 selectAllStrings,
 (strings: StringModel[]) => strings.find((string) => string.id === props.stringId)?.panelPaths,
 )
 */