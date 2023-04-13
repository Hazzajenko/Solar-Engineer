import { inject, Injectable } from '@angular/core'
import { CanvasStringsQueries } from './canvas-strings.queries'
import { CanvasStringsRepository } from './canvas-strings.repository'

@Injectable({
  providedIn: 'root',
})
export class CanvasStringsService {
  public select = inject(CanvasStringsQueries)
  public dispatch = inject(CanvasStringsRepository)
}
