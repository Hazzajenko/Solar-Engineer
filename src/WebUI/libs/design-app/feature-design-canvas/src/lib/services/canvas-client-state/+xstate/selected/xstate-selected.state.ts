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

export const SELECTED_STATE = {
	STATE: 'SelectedState',
	NONE_SELECTED: 'SelectedState.NoneSelected',
	SINGLE_SELECTION: 'SelectedState.SingleSelection',
	MULTIPLE_SELECTION: 'SelectedState.MultipleSelection',
} as const

export type SelectedState = (typeof SELECTED_STATE)[keyof typeof SELECTED_STATE]
