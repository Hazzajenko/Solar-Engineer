import { createReducer, on } from '@ngrx/store'
import { TypeModel } from '@shared/data-access/models'
import { MultiActions } from './multi.actions'

export interface MultiState {
  multiMode: boolean
  typeToMultiCreate?: TypeModel

  locationStart?: string
  locationFinish?: string
}

export const initialMultiCreatesState: MultiState = {
  multiMode: false,
  typeToMultiCreate: undefined,
  locationStart: undefined,
  locationFinish: undefined,
}

export const multiReducer = createReducer(
  initialMultiCreatesState,

  on(MultiActions.toggleMultiMode, (state) => ({
    multiMode: !state.multiMode,
  })),

  on(MultiActions.startMultiSelect, (state, { location }) => ({
    multiMode: true,
    locationStart: location,
  })),

  on(MultiActions.finishMultiSelect, (state, { location }) => ({
    multiMode: true,
    locationStart: undefined,
    locationFinish: location,
  })),

  on(MultiActions.startMultiDelete, (state, { location }) => ({
    multiMode: true,
    locationStart: location,
  })),

  on(MultiActions.finishMultiDelete, (state, { location }) => ({
    multiMode: true,
    locationStart: undefined,
    locationFinish: location,
  })),

  on(MultiActions.startMultiCreatePanel, (state, { location }) => ({
    multiMode: true,
    typeToMultiCreate: TypeModel.PANEL,
    locationStart: location,
  })),

  on(MultiActions.finishMultiCreatePanel, (state, { location }) => ({
    multiMode: true,
    locationFinish: location,
  })),

  on(MultiActions.startMultiCreateRail, (state, { location }) => ({
    multiMode: true,
    typeToMultiCreate: TypeModel.RAIL,
    locationStart: location,
  })),

  on(MultiActions.finishMultiCreateRail, (state, { location }) => ({
    multiMode: true,
    locationFinish: location,
  })),

  on(MultiActions.clearMultiState, () => ({
    multiMode: false,
    typeToMultiCreate: undefined,
    location: undefined,
  })),
)
