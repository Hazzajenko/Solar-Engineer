import * as State from './grid-selected.reducer'
import { createFeatureSelector, createSelector } from '@ngrx/store'
import { TypeModel } from '@shared/data-access/models'

export interface SelectedStringModel {
  type: TypeModel
  selectedStringId: string
}

export const selectSelectedState = createFeatureSelector<State.SelectedState>('selected')

export const selectSelectedMultiIds = createSelector(
  selectSelectedState,
  (state: State.SelectedState) => state.multiSelectIds,
)

/* export const selectSelectedStringModel = createSelector(
 selectSelectedState,
 (state: State.SelectedState) => {
 const selectedString: SelectedStringModel = {
 // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
 // type: state.type!,
 // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
 selectedStringId: state.selectedStringId!,
 }
 return selectedString
 },
 ) */
export const selectSelectedUnitAndIds = createSelector(
  selectSelectedState,
  (state: State.SelectedState) => state,
)

export const selectUnitSelected = createSelector(
  selectSelectedState,
  (state: State.SelectedState) => state.type,
)

export const selectMultiSelectUnit = createSelector(
  selectSelectedState,
  (state: State.SelectedState) => state.multiSelectType,
)
export const selectIfMultiSelect = createSelector(
  selectSelectedState,
  (state: State.SelectedState) => state.multiSelect,
)

export const selectSelectedId = createSelector(
  selectSelectedState,
  (state: State.SelectedState) => state.singleSelectId,
)

export const selectSelectedPanelId = createSelector(
  selectSelectedState,
  (state: State.SelectedState) => state.selectedPanelId,
)

export const selectSelectedIdWithType = createSelector(
  selectSelectedState,
  (state: State.SelectedState) => {
    return {
      singleSelectId: state.singleSelectId,
      type: state.type,
    }
  },
)
export const selectSelectedStringId = createSelector(
  selectSelectedState,
  (state: State.SelectedState) => state.selectedStringId,
)
export const selectMultiSelectIds = createSelector(
  selectSelectedState,
  (state: State.SelectedState) => state.multiSelectIds,
)

export const singleAndMultiSelectIds = createSelector(
  selectSelectedState,
  (state: State.SelectedState) => {
    return {
      singleId: state.singleSelectId,
      multiIds: state.multiSelectIds,
    }
  },
)

export const selectSelectedPositiveTo = createSelector(
  selectSelectedState,
  (state: State.SelectedState) => state.selectedPositiveLinkTo,
)

export const selectSelectedNegativeTo = createSelector(
  selectSelectedState,
  (state: State.SelectedState) => state.selectedNegativeLinkTo,
)

export const selectSelectedStringTooltip = createSelector(
  selectSelectedState,
  (state: State.SelectedState) => state.selectedStringTooltip,
)

export const selectSelectedStringPathMap = createSelector(
  selectSelectedState,
  (state: State.SelectedState) => state.selectedStringPathMap,
)

export const selectSelectedPanelPathMap = createSelector(
  selectSelectedState,
  (state: State.SelectedState) => state.selectedPanelPathMap,
)

/*   this.isSelectedPanel$ = this.store
 .select(selectSelectedPanelId)
 .pipe(map((selectedPanelId) => selectedPanelId === this.id))
 this.isSelectedPositiveTo$ = this.store
 .select(selectSelectedPositiveTo)
 .pipe(map((positiveTo) => positiveTo === this.id))
 this.isSelectedNegativeTo$ = this.store
 .select(selectSelectedNegativeTo)
 .pipe(map((negativeTo) => negativeTo === this.id))
 this.isSelectedString$ = this.store
 .select(selectSelectedStringId)
 .pipe(combineLatestWith(this.panel$))
 .pipe(map(([selectedStringId, panel]) => selectedStringId === panel?.stringId))
 this.isPanelToJoin$ = this.store
 .select(selectPanelToLink)
 .pipe(map((panelToLink) => panelToLink?.id === this.id)) */

/*
 export const selectSelectedPanels = createSelector(
 selectSelectedState,
 (state: State.SelectedState) => state.panels,
 )

 export const selectSelectedStrings = createSelector(
 selectSelectedState,
 (state: State.SelectedState) => state.string,
 )

 export const selectSelectedDisconnectionPoint = createSelector(
 selectSelectedState,
 (state: State.SelectedState) => state.disconnectionPoint,
 )
 */