import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity'
import { createReducer, on } from '@ngrx/store'
import { CableStateActions } from './cable.actions'
import { CableModel } from '../../models/cable.model'

export const selectCableId = (b: CableModel): number => b.id

export const cableAdapter: EntityAdapter<CableModel> =
  createEntityAdapter<CableModel>({
    selectId: selectCableId,
  })

export const initialCableState = cableAdapter.getInitialState({})

export const cableReducer = createReducer(
  initialCableState,

  on(CableStateActions.addCable, (state, { cable }) =>
    cableAdapter.addOne(cable, state),
  ),

  on(CableStateActions.addManyCables, (state, { cables }) =>
    cableAdapter.addMany(cables, state),
  ),

  on(CableStateActions.updateCable, (state, { cable }) =>
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

  on(CableStateActions.deleteCable, (state, { cable }) =>
    cableAdapter.removeOne(cable.id, state),
  ),
)

export const { selectIds, selectEntities, selectAll } =
  cableAdapter.getSelectors()

export type CableState = EntityState<CableModel>
