import { inject, Injectable } from '@angular/core'
import { CanvasClientStateService, CanvasMode } from './canvas-client-state'

@Injectable({
	providedIn: 'root',
})
export class CanvasModeService {
	private _mode: CanvasMode = 'select'
	private _state = inject(CanvasClientStateService)

	get mode() {
		// return this._mode
		return this._state.mode.mode
	}

	setMode(mode: CanvasMode) {
		console.log('CanvasModeService.setMode', mode)
		this._mode = mode
		this._state.updateState({ mode: { mode } })

	}

}
