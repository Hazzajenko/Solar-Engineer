import { GraphicsActions } from './graphics.actions'
import { CreatePreviewState, NearbyLinesState } from './graphics.types'
import { inject, Injectable } from '@angular/core'
import { Store } from '@ngrx/store'


@Injectable({
	providedIn: 'root',
})
export class GraphicsRepository {
	private _store = inject(Store)

	setCreatePreview(createPreview: CreatePreviewState) {
		this._store.dispatch(GraphicsActions.setCreatePreview({ createPreview }))
	}

	setNearbyLines(nearbyLines: NearbyLinesState) {
		this._store.dispatch(GraphicsActions.setNearbyLines({ nearbyLines }))
	}

	resetGraphicsToDefault() {
		this._store.dispatch(GraphicsActions.resetGraphicsToDefault())
	}
}