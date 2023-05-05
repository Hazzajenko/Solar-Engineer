import { GraphicsState, initialGraphicsState } from './graphics.reducer'
import { GraphicsRepository } from './graphics.repository'
import { selectGraphicsState } from './graphics.selectors'
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

	repository = inject(GraphicsRepository)

	get state$() {
		return this._graphics$
	}

	private get state() {
		return this._graphics()
	}

	get matches() {
		let res = {}
		for (const key in this.state) {
			const k = key as keyof GraphicsState
			res = {
				...res,
				[key]: (value: GraphicsState[typeof k]) => this.state[k] === value,
			}
		}
		return res as {
			[key in keyof GraphicsState]: (value: GraphicsState[key]) => boolean
		}
		// return res as GraphicsStateMatches
	}

	get snapshot() {
		return {
			state: this.state,
			matches: this.matches,
		}
	}
}

export type GraphicsStateSnapshot = {
	state: GraphicsState
	matches: GraphicsStateMatches
}

type GraphicsStateMatches = {
	[key in keyof GraphicsState]: (value: GraphicsState[key]) => boolean
}