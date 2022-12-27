import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity'
import { Action, createReducer, on } from '@ngrx/store'
import { PanelLinkModel } from '@shared/data-access/models'

import { LinksActions } from './links.actions'

export const LINKS_FEATURE_KEY = 'links'

export interface LinksState extends EntityState<PanelLinkModel> {
  loaded: boolean
  error?: string | null
}

export interface LinksPartialState {
  readonly [LINKS_FEATURE_KEY]: LinksState
}

export const linksAdapter: EntityAdapter<PanelLinkModel> = createEntityAdapter<PanelLinkModel>()

export const initialLinksState: LinksState = linksAdapter.getInitialState({
  // set initial required properties
  loaded: false,
})

const reducer = createReducer(
  initialLinksState,
  on(LinksActions.initLinks, (state) => ({ ...state, loaded: false, error: null })),
  on(LinksActions.loadLinksSuccess, (state, { links }) =>
    linksAdapter.setAll(links, { ...state, loaded: true }),
  ),
  on(LinksActions.loadLinksFailure, (state, { error }) => ({ ...state, error })),
)

export function linksReducer(state: LinksState | undefined, action: Action) {
  return reducer(state, action)
}