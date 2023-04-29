import { CanvasPanelsStore } from './canvas-panels.store'
import { CanvasStringsStore } from './canvas-strings.store'
import { inject, Injectable } from '@angular/core'


@Injectable({
	providedIn: 'root',
})
export class EntityStoreService {
	panels = inject(CanvasPanelsStore)
	strings = inject(CanvasStringsStore)
}