import { CompleteEntityBounds } from '../../../utils'
import { TypeOfEntity } from '@design-app/feature-selected'

export type SelectedEntity = TypeOfEntity

export type SelectedStateDeprecated = {
	selectedStringId: string | undefined
	singleSelectedId: string | undefined
	multipleSelectedIds: string[]
	selectionBoxBounds: CompleteEntityBounds | undefined
}

export const InitialSelectedState: SelectedStateDeprecated = {
	// ids: [],
	// entities: {},
	selectedStringId: undefined,
	singleSelectedId: undefined,
	multipleSelectedIds: [],
	selectionBoxBounds: undefined,
}