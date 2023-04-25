export type AdjustedSelectedState = {
	selectedStringId: string | undefined
	singleSelectedId: string | undefined
	multipleSelectedIds: string[]
}

export const AdjustedInitialSelectedState: AdjustedSelectedState = {
	selectedStringId: undefined,
	singleSelectedId: undefined,
	multipleSelectedIds: [],
}

export const SELECTED_STATE_KEY = 'SelectedState'

export const SELECTED_STATE = {
	NONE_SELECTED: 'NoneSelected',
	SINGLE_SELECTION: 'SingleSelection',
	MULTIPLE_SELECTION: 'MultipleSelection',
} as const

export type SelectedState = (typeof SELECTED_STATE)[keyof typeof SELECTED_STATE]
export const MATCHES_SELECTED_STATE = {
	STATE: 'SelectedState',
	NONE_SELECTED: 'SelectedState.NoneSelected',
	SINGLE_SELECTION: 'SelectedState.SingleSelection',
	MULTIPLE_SELECTION: 'SelectedState.MultipleSelection',
} as const
