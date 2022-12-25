import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity'
import { Action, createReducer, on } from '@ngrx/store'
import { EntityModel } from '@shared/data-access/models'

import { EntitiesActions } from './entities.actions'

export const ENTITIES_FEATURE_KEY = 'entities'

export interface EntitiesState extends EntityState<EntityModel> {
  loaded: boolean
  error?: string | null
}

export interface EntitiesPartialState {
  readonly [ENTITIES_FEATURE_KEY]: EntitiesState
}

export const entitiesAdapter: EntityAdapter<EntityModel> = createEntityAdapter<EntityModel>()

export const initialEntitiesState: EntitiesState = entitiesAdapter.getInitialState({
  loaded: false,
})

const reducer = createReducer(
  initialEntitiesState,
  on(EntitiesActions.addEntityForGrid, (state, { entity }) =>
    entitiesAdapter.addOne(entity, state),
  ),

  on(EntitiesActions.addManyEntitiesForGrid, (state, { entities }) =>
    entitiesAdapter.addMany(entities, state),
  ),

  on(EntitiesActions.updateEntityForGrid, (state, { update }) =>
    entitiesAdapter.updateOne(update, state),
  ),

  on(EntitiesActions.updateManyEntitiesForGrid, (state, { updates }) =>
    entitiesAdapter.updateMany(updates, state),
  ),

  on(EntitiesActions.deleteEntityForGrid, (state, { entityId }) =>
    entitiesAdapter.removeOne(entityId, state),
  ),

  on(EntitiesActions.deleteManyEntitiesForGrid, (state, { entityIds }) =>
    entitiesAdapter.removeMany(entityIds, state),
  ),

  on(EntitiesActions.clearEntitiesState, (state) => entitiesAdapter.removeAll(state)),
)

export function entitiesReducer(state: EntitiesState | undefined, action: Action) {
  return reducer(state, action)
}
