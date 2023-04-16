import { inject, Injectable } from '@angular/core'
import { CanvasAppStateQueries } from './canvas-app-state.queries'
import { CanvasAppStateRepository } from './canvas-app-state.repository'

@Injectable({
  providedIn: 'root',
})
export class CanvasAppStateStore {
  public select = inject(CanvasAppStateQueries)
  public dispatch = inject(CanvasAppStateRepository)
}
