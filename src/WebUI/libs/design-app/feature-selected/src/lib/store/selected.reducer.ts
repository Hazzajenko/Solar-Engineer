import { TypeOfEntity } from '../types'
import { NearbyEntityOnAxis } from '../types/nearby-entity-on-axis'
import { SelectedActions } from './selected.actions'
import { Action, createReducer, on } from '@ngrx/store'
import { Point } from '@shared/data-access/models'


export const SELECTED_FEATURE_KEY = 'selected'

export interface SelectedState {
  singleSelectedEntity: TypeOfEntity | undefined
  multiSelectedEntities: TypeOfEntity[]
  selectedStringId: string | undefined
  nearbyEntitiesOnAxis: NearbyEntityOnAxis[]
  multiSelectionBoxStart: Point | undefined
}

export const initialSelectedState: SelectedState = {
  singleSelectedEntity: undefined,
  multiSelectedEntities: [],
  selectedStringId: undefined,
  nearbyEntitiesOnAxis: [],
  multiSelectionBoxStart: undefined,
}

const reducer = createReducer(
  initialSelectedState,

  /**
   * * Single Selected Entity
   */
  on(SelectedActions.selectEntity, (state, { entity }) => ({
    ...state,
    singleSelectedEntity: entity,
  })),

  on(SelectedActions.clearSingleSelected, (state) => ({
    ...state,
    singleSelectedEntity: undefined,
  })),

  /**
   * * Multi Selected Entities
   */

  on(SelectedActions.selectMultipleEntities, (state, { entities }) => ({
    ...state,
    multiSelectedEntities: entities,
    singleSelectedEntity: undefined,
  })),

  on(SelectedActions.startMultiselect, (state, { entity }) => ({
    ...state,
    multiSelectedEntities: [entity],
    singleSelectedEntity: undefined,
  })),

  on(SelectedActions.addEntityToMultiselect, (state, { entity }) => ({
    ...state,
    multiSelectedEntities: [...state.multiSelectedEntities, entity],
    singleSelectedEntity: undefined,
  })),

  on(SelectedActions.clearMultiSelected, (state) => ({
    ...state,
    multiSelectedEntities: [],
  })),

  /**
   * * Selected String
   */

  on(SelectedActions.selectString, (state, { stringId }) => ({
    ...state,
    selectedStringId: stringId,
    singleSelectedEntity: undefined,
    multiSelectedEntities: [],
  })),

  /**
   * * Nearby Entities On Axis
   */
  on(SelectedActions.addNearbyEntityOnAxis, (state, { entity }) => ({
    ...state,
    nearbyEntitiesOnAxis: state.nearbyEntitiesOnAxis.find((e) => e.id === entity.id)
      ? state.nearbyEntitiesOnAxis
      : [...state.nearbyEntitiesOnAxis, entity],
  })),

  on(SelectedActions.addManyNearbyEntitiesOnAxis, (state, { entities }) => ({
    ...state,
    nearbyEntitiesOnAxis: [...state.nearbyEntitiesOnAxis, ...entities],
  })),

  on(SelectedActions.clearNearbyEntitiesOnAxis, (state) => ({
    ...state,
    nearbyEntitiesOnAxis: [],
  })),

  /**
   * * Multi Selection Box
   */

  on(SelectedActions.startMultiSelectionBox, (state, { point }) => ({
    ...state,
    multiSelectionBoxStart: point,
  })),

  on(SelectedActions.stopMultiSelectionBox, (state, { entities }) => ({
    ...state,
    multiSelectionBoxStart: undefined,
    multiSelectedEntities: entities,
  })),

  /**
   * * Clear Selected State
   */

  on(SelectedActions.clearSelectedState, () => ({
    ...initialSelectedState,
  })),
)

export function selectedReducer(state: SelectedState | undefined, action: Action) {
  return reducer(state, action)
}