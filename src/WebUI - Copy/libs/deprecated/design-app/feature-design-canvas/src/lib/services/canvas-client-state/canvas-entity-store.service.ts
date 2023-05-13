import { CanvasEntity } from '../../types'
import { CanvasPanelsStore } from './canvas-panels.store'
import { CanvasStringsStore } from './canvas-strings.store'
import { inject, Injectable } from '@angular/core'
import { Dictionary } from '@ngrx/entity'

export type EntityDataState = {
	ids: string[]
	entities: Dictionary<CanvasEntity>
}

@Injectable({
	providedIn: 'root',
})
export class CanvasEntityStore {
	// panels = inject(CanvasPanelsStore)
	panels = inject(CanvasPanelsStore)
	strings = inject(CanvasStringsStore)
}
