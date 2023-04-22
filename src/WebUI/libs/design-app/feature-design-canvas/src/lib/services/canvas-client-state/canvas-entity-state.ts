// import { CanvasEntity } from '@design-app/feature-design-canvas'
import { inject, Injectable } from '@angular/core'
import { Dictionary } from '@ngrx/entity'
import { CanvasEntity } from '../../types'
import { CanvasEntitiesStore } from './canvas-entities.store'
import { CanvasStringsStore } from './canvas-strings.store'

export type EntityDataState = {
  ids: string[]
  entities: Dictionary<CanvasEntity>
}

@Injectable({
  providedIn: 'root',
})
export class CanvasEntityState {
  canvasEntities = inject(CanvasEntitiesStore)
  canvasStrings = inject(CanvasStringsStore)
}