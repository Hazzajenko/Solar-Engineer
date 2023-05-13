import { inject, Injectable } from '@angular/core'

import { GridSelectedFacade } from './grid-selected.facade'
import { GridSelectedRepository } from './grid-selected.repository'

@Injectable({
  providedIn: 'root',
})
export class GridSelectedStoreService {
  public select = inject(GridSelectedFacade)
  public dispatch = inject(GridSelectedRepository)
}
