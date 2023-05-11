import { GraphicsActions } from './graphics.actions'
import { GraphicsState, initialGraphicsState } from './graphics.reducer'
import { selectGraphicsState } from './graphics.selectors'
import { CreatePreviewState, NearbyLinesState } from './graphics.types'
import { inject, Injectable } from '@angular/core'
import { toSignal } from '@angular/core/rxjs-interop'
import { select, Store } from '@ngrx/store'

@Injectable({
	providedIn: 'root',
})
export class GraphicsStoreService {
	private readonly _store: Store<GraphicsState> = inject(Store)
	private readonly _graphics$ = this._store.pipe(select(selectGraphicsState))
	private readonly _graphics = toSignal(this._graphics$, { initialValue: initialGraphicsState })

	dispatch = new GraphicsRepository(this._store)

	get state$() {
		return this._graphics$
	}

	get state() {
		return this._store.selectSignal(selectGraphicsState)()
	}
}

class GraphicsRepository {
	constructor(private _store: Store<GraphicsState>) {}

	toggleCreatePreview() {
		this._store.dispatch(GraphicsActions.toggleCreatePreview())
	}

	setCreatePreview(createPreview: CreatePreviewState) {
		this._store.dispatch(GraphicsActions.setCreatePreview({ createPreview }))
	}

	toggleNearbyLines() {
		this._store.dispatch(GraphicsActions.toggleNearbyLines())
	}

	setNearbyLines(nearbyLines: NearbyLinesState) {
		this._store.dispatch(GraphicsActions.setNearbyLines({ nearbyLines }))
	}

	toggleColouredStrings() {
		this._store.dispatch(GraphicsActions.toggleColouredStrings())
	}

	toggleSelectedPanelFill() {
		this._store.dispatch(GraphicsActions.toggleSelectedPanelFill())
	}

	toggleSelectedStringPanelFill() {
		this._store.dispatch(GraphicsActions.toggleSelectedStringPanelFill())
	}

	resetGraphicsToDefault() {
		this._store.dispatch(GraphicsActions.resetGraphicsToDefault())
	}
}

/*

 export type GraphicsStateSnapshot = {
 state: GraphicsState
 matches: GraphicsStateMatches
 }

 type GraphicsStateMatches = {
 [key in keyof GraphicsState]: (value: GraphicsState[key]) => boolean
 }*/
