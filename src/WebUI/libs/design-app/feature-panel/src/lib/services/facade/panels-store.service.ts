import { inject, Injectable } from '@angular/core'
import { PanelsQueries } from './panels.queries'
import { PanelsRepository } from './panels.repository'

@Injectable({
  providedIn: 'root',
})
export class PanelsStoreService {
  public select = inject(PanelsQueries)
  public dispatch = inject(PanelsRepository)
}
