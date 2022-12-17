import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity'
import { createReducer, on } from '@ngrx/store'
import { CableStateActions } from './cable.actions'
import { CableModel } from '../../models/deprecated-for-now/cable.model'

export const selectCableId = (b: CableModel): string => b.id

export const cableAdapter: EntityAdapter<CableModel> = createEntityAdapter<CableModel>({
  selectId: selectCableId,
})

export const initialCableState = cableAdapter.getInitialState({})

export const cableReducer = createReducer(
  initialCableState,

  on(CableStateActions.addCableToState, (state, { cable }) => cableAdapter.addOne(cable, state)),

  on(CableStateActions.addManyCables, (state, { cables }) => cableAdapter.addMany(cables, state)),

  on(CableStateActions.updateCableToState, (state, { cable }) =>
    cableAdapter.updateOne(
      {
        id: cable.id,
        changes: cable,
      },
      state,
    ),
  ),

  on(CableStateActions.updateManyCable, (state, { cables }) =>
    cableAdapter.updateMany(cables, state),
  ),

  on(CableStateActions.deleteCableToState, (state, { cableId }) =>
    cableAdapter.removeOne(cableId, state),
  ),
)

export const { selectIds, selectEntities, selectAll } = cableAdapter.getSelectors()

export type CableState = EntityState<CableModel>
