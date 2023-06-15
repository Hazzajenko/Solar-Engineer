import { Store } from '@ngrx/store'
import { createRootServiceInjector } from '@shared/utils'
import { ObjectPositioningActions } from './object-positioning.actions'
import { objectPositioningFeature } from './object-positioning.feature'

export function injectObjectPositioningStore(): ObjectPositioningStore {
	return objectPositioningInjector()
}

const objectPositioningInjector = createRootServiceInjector(objectPositioningFactory, {
	deps: [Store],
})

export type ObjectPositioningStore = ReturnType<typeof objectPositioningFactory>

function objectPositioningFactory(store: Store) {
	const feature = objectPositioningFeature

	const state = store.selectSignal(feature.selectObjectPositioningState)
	const cursorState = store.selectSignal(feature.selectCursorState)

	const select = {
		state,
		cursorState,
	}

	const startMovingSingleEntity = (entityId: string) =>
		store.dispatch(ObjectPositioningActions.startMovingSingleEntity({ entityId }))

	const startMovingMultipleEntities = (entityIds: string[]) =>
		store.dispatch(ObjectPositioningActions.startMovingMultipleEntities({ entityIds }))

	const setToMoveSpotTaken = () => store.dispatch(ObjectPositioningActions.setMovingSpotTaken())

	const setToMoveSpotFree = () => store.dispatch(ObjectPositioningActions.setMovingSpotFree())

	const setMultipleMovingSpotsTaken = (toMoveMultipleSpotTakenIds: string[]) =>
		store.dispatch(
			ObjectPositioningActions.setMultipleMovingSpotsTaken({ toMoveMultipleSpotTakenIds }),
		)

	const clearMultipleMovingSpotsTaken = () =>
		store.dispatch(ObjectPositioningActions.clearMultipleMovingSpotsTaken())

	const stopMoving = () => store.dispatch(ObjectPositioningActions.stopMoving())

	const startRotatingSingleEntity = (entityId: string) =>
		store.dispatch(ObjectPositioningActions.startRotatingSingleEntity({ entityId }))

	const startRotatingMultipleEntities = (entityIds: string[]) =>
		store.dispatch(ObjectPositioningActions.startRotatingMultipleEntities({ entityIds }))

	const stopRotating = () => store.dispatch(ObjectPositioningActions.stopRotating())

	const clearObjectPositioningState = () =>
		store.dispatch(ObjectPositioningActions.clearObjectPositioningState())

	const dispatch = {
		startMovingSingleEntity,
		startMovingMultipleEntities,
		setToMoveSpotTaken,
		setToMoveSpotFree,
		setMultipleMovingSpotsTaken,
		clearMultipleMovingSpotsTaken,
		stopMoving,
		startRotatingSingleEntity,
		startRotatingMultipleEntities,
		stopRotating,
		clearObjectPositioningState,
	}

	return {
		select,
		dispatch,
	}
}
