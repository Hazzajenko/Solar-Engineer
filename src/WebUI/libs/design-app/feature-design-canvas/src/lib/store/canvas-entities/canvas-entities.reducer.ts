import { CanvasEntitiesActions } from './canvas-entities.actions'
import { CanvasEntity } from '@design-app/feature-design-canvas'
import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity'
import { Action, createReducer, on } from '@ngrx/store'

export const CANVAS_ENTITIES_FEATURE_KEY = 'canvas-entities'

export interface CanvasEntitiesState extends EntityState<CanvasEntity> {
  loaded: boolean
  error?: string | null
}

export interface CanvasEntitiesPartialState {
  readonly [CANVAS_ENTITIES_FEATURE_KEY]: CanvasEntitiesState
}

export const canvasEntitiesAdapter: EntityAdapter<CanvasEntity> = createEntityAdapter<CanvasEntity>(
  {
    selectId: (entity) => entity.id,
  },
)

export const initialCanvasEntitiesState: CanvasEntitiesState =
  canvasEntitiesAdapter.getInitialState({
    loaded: false,
  })

const reducer = createReducer(
  initialCanvasEntitiesState,
  on(CanvasEntitiesActions.addEntity, (state, { entity }) =>
    canvasEntitiesAdapter.addOne(entity, state),
  ),
  on(CanvasEntitiesActions.addManyEntities, (state, { entities }) =>
    canvasEntitiesAdapter.addMany(entities, state),
  ),
  on(CanvasEntitiesActions.updateEntity, (state, { update }) =>
    canvasEntitiesAdapter.updateOne(update, state),
  ),
  on(CanvasEntitiesActions.updateManyEntities, (state, { updates }) =>
    canvasEntitiesAdapter.updateMany(updates, state),
  ),
  on(CanvasEntitiesActions.deleteEntity, (state, { entityId }) =>
    canvasEntitiesAdapter.removeOne(entityId, state),
  ),
  on(CanvasEntitiesActions.deleteManyEntities, (state, { entityIds }) =>
    canvasEntitiesAdapter.removeMany(entityIds, state),
  ),
  on(CanvasEntitiesActions.clearCanvasEntitiesState, () => initialCanvasEntitiesState),
)

export function canvasEntitiesReducer(state: CanvasEntitiesState | undefined, action: Action) {
  return reducer(state, action)
}