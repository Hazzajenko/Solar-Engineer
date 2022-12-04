import { createReducer, on } from '@ngrx/store'
import { UnitModel } from '../../../../models/unit.model'
import { MultiCreateActions } from './multi-create.actions'

export interface MultiCreateState {
  typeToMultiCreate?: UnitModel

  locationStart?: string
  locationFinish?: string
}

export const initialMultiCreatesState: MultiCreateState = {
  typeToMultiCreate: undefined,
  locationStart: undefined,
  locationFinish: undefined,
}

export const multiCreateReducer = createReducer(
  initialMultiCreatesState,

  on(MultiCreateActions.startMultiCreatePanel, (state, { location }) => ({
    typeToMultiCreate: UnitModel.PANEL,
    locationStart: location,
  })),

  on(MultiCreateActions.finishMultiCreatePanel, (state, { location }) => ({
    locationFinish: location,
  })),

  on(MultiCreateActions.startMultiCreateRail, (state, { location }) => ({
    typeToMultiCreate: UnitModel.RAIL,
    locationStart: location,
  })),

  on(MultiCreateActions.finishMultiCreateRail, (state, { location }) => ({
    locationFinish: location,
  })),

  on(MultiCreateActions.clearMultiCreateState, () => ({
    typeToMultiCreate: undefined,
    location: undefined,
  })),
)
