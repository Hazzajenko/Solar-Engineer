import { CanvasString } from '../../types/canvas-string'
import {
	CANVAS_STRINGS_FEATURE_KEY,
	canvasStringsAdapter,
	CanvasStringsState,
} from './canvas-strings.reducer'
import { createFeatureSelector, createSelector } from '@ngrx/store'

export const selectCanvasStringsState = createFeatureSelector<CanvasStringsState>(
	CANVAS_STRINGS_FEATURE_KEY,
)

const { selectAll, selectEntities } = canvasStringsAdapter.getSelectors()

export const selectAllCanvasStrings = createSelector(
	selectCanvasStringsState,
	(state: CanvasStringsState) => selectAll(state),
)

export const selectCanvasStringsViaDictionary = createSelector(
	selectCanvasStringsState,
	(state: CanvasStringsState) => selectEntities(state),
)

export const selectCanvasStringByIdViaDictionary = (props: { id: string }) =>
	createSelector(selectCanvasStringsViaDictionary, (entities) => entities[props.id])

export const selectCanvasStringById = (props: { id: string }) =>
	createSelector(selectAllCanvasStrings, (panels: CanvasString[]) =>
		panels.find((panel) => panel.id === props.id),
	)

export const selectCanvasStringsByIdArray = (props: { ids: string[] }) =>
	createSelector(selectAllCanvasStrings, (entities: CanvasString[]) =>
		entities.filter((string) => props.ids.includes(string.id)),
	)
