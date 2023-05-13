import { Action, createReducer, on } from '@ngrx/store'
import { TypeModel } from '@shared/data-access/models'
import { MultiActions } from './multi.actions'

export const MULTI_FEATURE_KEY = 'multi'

export interface MultiState {
  multiMode: boolean
  type?: TypeModel
  locationStart?: string
  locationFinish?: string
}

export const initialMultiCreatesState: MultiState = {
  multiMode: false,
  type: undefined,
  locationStart: undefined,
  locationFinish: undefined,
}

const reducer = createReducer(
  initialMultiCreatesState,

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
    locationStart: undefined,
    locationFinish: location,
  })),

  on(MultiActions.clearMultiState, () => ({
    multiMode: false,
    locationStart: undefined,
    locationFinish: undefined,
  })),
)

export function multiReducer(state: MultiState | undefined, action: Action) {
  return reducer(state, action)
}
