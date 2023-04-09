import { SELECTED_FEATURE_KEY, SelectedState } from './selected.reducer'
import { SelectedPanelState } from '@design-app/feature-panel'
import { EntityType } from '@design-app/shared'
import { createFeatureSelector, createSelector } from '@ngrx/store'

export const selectSelectedState = createFeatureSelector<SelectedState>(SELECTED_FEATURE_KEY)

export const selectSingleSelectedEntity = createSelector(
  selectSelectedState,
  (state: SelectedState) => state.singleSelectedEntity,
)

export const selectMultiSelectedEntities = createSelector(
  selectSelectedState,
  (state: SelectedState) => state.multiSelectedEntities,
)

export const selectSingleAndMultiSelectedEntities = createSelector(
  selectSingleSelectedEntity,
  selectMultiSelectedEntities,
  (singleSelected, multiSelected) => ({
    singleSelected,
    multiSelected,
  }),
)

export const selectSelectedStringId = createSelector(
  selectSelectedState,
  (state: SelectedState) => state.selectedStringId,
)

export const selectNearbyEntitiesOnAxis = createSelector(
  selectSelectedState,
  (state: SelectedState) => state.nearbyEntitiesOnAxis,
)

export const selectSelectedPanelState = (props: { id: string }) =>
  createSelector(
    selectIsEntitySingleSelected(props),
    selectIsEntityMultiSelected(props),
    (isSingleSelected, isMultiSelected) => {
      if (isSingleSelected) {
        return SelectedPanelState.SingleSelected
      }
      if (isMultiSelected) {
        return SelectedPanelState.MultiSelected
      }
      return SelectedPanelState.NoneSelected
    },
  )

export const selectIsEntitySingleSelected = (props: { id: string }) =>
  createSelector(
    selectSingleSelectedEntity,
    (singleSelectedEntity) => singleSelectedEntity?.id === props.id,
  )

export const selectIsEntityMultiSelected = (props: { id: string }) =>
  createSelector(
    selectMultiSelectedEntities,
    (multiSelectedEntities) =>
      multiSelectedEntities.find((entity) => entity.id === props.id) !== undefined,
  )

/*map(([selected, multiSelected]) => {
 if (selected === this._panelId) {
 return SelectedPanelState.SingleSelected
 }
 if (multiSelected.find((selected) => selected.includes(this._panelId))) {
 return SelectedPanelState.MultiSelected
 }
 return SelectedPanelState.NoneSelected
 }),*/

export const selectMultiSelectedEntitiesOfType = (type: EntityType) =>
  createSelector(selectMultiSelectedEntities, (entities) =>
    entities.filter((entity) => entity.type === type),
  )

export const selectMultiSelectedEntitiesOfTypeCount = (type: EntityType) =>
  createSelector(selectMultiSelectedEntitiesOfType(type), (entities) => entities.length)

export const selectMultiSelectedEntitiesOfTypeIds = (type: EntityType) =>
  createSelector(selectMultiSelectedEntitiesOfType(type), (entities) => entities.map((e) => e.id))