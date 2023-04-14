import { inject, Injectable } from '@angular/core'
import { CanvasEntitiesQueries } from './canvas-entities.queries'
import { CanvasEntitiesRepository } from './canvas-entities.repository'

@Injectable({
  providedIn: 'root',
})
export class CanvasEntitiesStore {
  public select = inject(CanvasEntitiesQueries)
  public dispatch = inject(CanvasEntitiesRepository)
}
