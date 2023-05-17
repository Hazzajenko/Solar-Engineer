import { ObjectPositioningActions } from './object-positioning.actions'
import { initialObjectPositioningState, ObjectPositioningState } from './object-positioning.reducer'
import { selectObjectPositioningState } from './object-positioning.selectors'
import { inject, Injectable } from '@angular/core'
import { toSignal } from '@angular/core/rxjs-interop'
import { select, Store } from '@ngrx/store'

@Injectable({
	providedIn: 'root',
})
export class ObjectPositioningStoreService {
	private readonly _store = inject(Store<ObjectPositioningState>)
	private readonly _state$ = this._store.pipe(select(selectObjectPositioningState))
	private readonly _state = toSignal(this._state$, { initialValue: initialObjectPositioningState })
	dispatch = new ObjectPositioningRepository(this._store)

	get state$() {
		return this._state$
	}

	get state() {
		return this._state()
	}
}

class ObjectPositioningRepository {
	constructor(private readonly store: Store<ObjectPositioningState>) {}

	startMovingSingleEntity(entityId: string) {
		this.store.dispatch(ObjectPositioningActions.startMovingSingleEntity({ entityId }))
	}

	startMovingMultipleEntities(entityIds: string[]) {
		this.store.dispatch(ObjectPositioningActions.startMovingMultipleEntities({ entityIds }))
	}

	setToMoveSpotTaken() {
		this.store.dispatch(ObjectPositioningActions.setMovingSpotTaken())
	}

	setToMoveSpotFree() {
		this.store.dispatch(ObjectPositioningActions.setMovingSpotFree())
	}

	setMultipleMovingSpotsTaken(toMoveMultipleSpotTakenIds: string[]) {
		this.store.dispatch(
			ObjectPositioningActions.setMultipleMovingSpotsTaken({ toMoveMultipleSpotTakenIds }),
		)
	}

	clearMultipleMovingSpotsTaken() {
		this.store.dispatch(ObjectPositioningActions.clearMultipleMovingSpotsTaken())
	}

	stopMoving() {
		this.store.dispatch(ObjectPositioningActions.stopMoving())
	}

	startRotatingSingleEntity(entityId: string) {
		this.store.dispatch(ObjectPositioningActions.startRotatingSingleEntity({ entityId }))
	}

	startRotatingMultipleEntities(entityIds: string[]) {
		this.store.dispatch(ObjectPositioningActions.startRotatingMultipleEntities({ entityIds }))
	}

	stopRotating() {
		this.store.dispatch(ObjectPositioningActions.stopRotating())
	}

	clearObjectPositioningState() {
		this.store.dispatch(ObjectPositioningActions.clearObjectPositioningState())
	}
}
