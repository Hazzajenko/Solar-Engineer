import {
	CANVAS_ENTITIES_FEATURE_KEY,
	canvasEntitiesAdapter,
	CanvasEntitiesState,
} from './canvas-entities.reducer'
import { createFeatureSelector, createSelector } from '@ngrx/store'
import { CanvasEntity } from 'deprecated/design-app/feature-design-canvas'

export const selectPanelsState = createFeatureSelector<CanvasEntitiesState>(
	CANVAS_ENTITIES_FEATURE_KEY,
)

const { selectAll, selectEntities } = canvasEntitiesAdapter.getSelectors()

export const selectAllCanvasEntities = createSelector(
	selectPanelsState,
	(state: CanvasEntitiesState) => selectAll(state),
)

export const selectCanvasEntitiesViaDictionary = createSelector(
	selectPanelsState,
	(state: CanvasEntitiesState) => selectEntities(state),
)

export const selectCanvasEntityByIdViaDictionary = (props: { id: string }) =>
	createSelector(selectCanvasEntitiesViaDictionary, (entities) => entities[props.id])

export const selectCanvasEntityById = (props: { id: string }) =>
	createSelector(selectAllCanvasEntities, (panels: CanvasEntity[]) =>
		panels.find((panel) => panel.id === props.id),
	)

export const selectCanvasEntitiesByIdArray = (props: { ids: string[] }) =>
	createSelector(selectAllCanvasEntities, (entities: CanvasEntity[]) =>
		entities.filter((entity) => props.ids.includes(entity.id)),
	)