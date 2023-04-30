import { CanvasEntitiesQueries } from './canvas-entities.queries'
import { CanvasEntitiesRepository } from './canvas-entities.repository'
import { inject, Injectable } from '@angular/core'

@Injectable({
	providedIn: 'root',
})
export class CanvasEntitiesStore {
	public select = inject(CanvasEntitiesQueries)
	public dispatch = inject(CanvasEntitiesRepository)
}
