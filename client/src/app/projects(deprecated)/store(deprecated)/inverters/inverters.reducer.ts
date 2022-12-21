import * as InverterActions from './inverters.actions'
import { createReducer, on } from '@ngrx/store'
import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity'
import { InverterModel } from '../../models/deprecated-for-now/inverter.model'

export const selectInverterId = (b: InverterModel): string => b.id
export const sortByInverterName = (
  a: InverterModel,
  b: InverterModel,
): number => a.name.localeCompare(b.name)

export const inverterAdapter: EntityAdapter<InverterModel> =
  createEntityAdapter<InverterModel>({
    selectId: selectInverterId,
    sortComparer: sortByInverterName,
  })

export const initialInvertersState = inverterAdapter.getInitialState({})

export const invertersReducer = createReducer(
  initialInvertersState,

  on(InverterActions.addInverter, (state, { inverter }) =>
    inverterAdapter.addOne(inverter, state),
  ),

  on(InverterActions.addInvertersByProjectId, (state, { inverters }) =>
    inverterAdapter.addMany(inverters, state),
  ),

  on(InverterActions.deleteInverter, (state, { inverterId }) =>
    inverterAdapter.removeOne(inverterId, state),
  ),
)

export const { selectIds, selectEntities, selectAll } =
  inverterAdapter.getSelectors()

export type InverterState = EntityState<InverterModel>
