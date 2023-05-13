import { CanvasAppStateQueries } from './canvas-app-state.queries'
import { CanvasAppStateRepository } from './canvas-app-state.repository'
import { inject, Injectable } from '@angular/core'

@Injectable({
	providedIn: 'root',
})
export class CanvasAppStateStore {
	public select = inject(CanvasAppStateQueries)
	public dispatch = inject(CanvasAppStateRepository)
}
