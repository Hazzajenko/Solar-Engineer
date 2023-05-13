import { inject, Injectable } from '@angular/core'
import { Store } from '@ngrx/store'
import { Point } from '@shared/data-access/models'
import { CanvasAppStateActions } from 'deprecated/design-app/feature-design-canvas'

@Injectable({
	providedIn: 'root',
})
export class CanvasAppStateRepository {
	private _store = inject(Store)

	setHoveringEntityId(hoveringEntityId: string | undefined) {
		this._store.dispatch(CanvasAppStateActions.setHoveringEntityId({ hoveringEntityId }))
	}

	setSelectedId(selectedId: string | undefined) {
		this._store.dispatch(CanvasAppStateActions.setSelectedId({ selectedId }))
	}

	setSelectedIds(selectedIds: string[]) {
		this._store.dispatch(CanvasAppStateActions.setSelectedIds({ selectedIds }))
	}

	addToSelectedIds(selectedIds: string[]) {
		this._store.dispatch(CanvasAppStateActions.addToSelectedIds({ selectedIds }))
	}

	removeFromSelectedIds(selectedIds: string[]) {
		this._store.dispatch(CanvasAppStateActions.removeFromSelectedIds({ selectedIds }))
	}

	setSelectedStringId(selectedStringId: string | undefined) {
		this._store.dispatch(CanvasAppStateActions.setSelectedStringId({ selectedStringId }))
	}

	setRotatingEntityId(rotatingEntityId: string | undefined) {
		this._store.dispatch(CanvasAppStateActions.setRotatingEntityId({ rotatingEntityId }))
	}

	setRotatingEntityIds(rotatingEntityIds: string[]) {
		this._store.dispatch(CanvasAppStateActions.setRotatingEntityIds({ rotatingEntityIds }))
	}

	setDraggingEntityId(draggingEntityId: string | undefined) {
		this._store.dispatch(CanvasAppStateActions.setDraggingEntityId({ draggingEntityId }))
	}

	setDraggingEntityLocation(draggingEntityLocation: Point | undefined) {
		this._store.dispatch(
			CanvasAppStateActions.setDraggingEntityLocation({ draggingEntityLocation }),
		)
	}

	setDraggingEntityIds(draggingEntityIds: string[]) {
		this._store.dispatch(CanvasAppStateActions.setDraggingEntityIds({ draggingEntityIds }))
	}

	clearState() {
		this._store.dispatch(CanvasAppStateActions.clearState())
	}
}
