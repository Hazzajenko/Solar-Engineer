import { inject, Injectable } from '@angular/core'

import { GridStringsFacade } from './grid-strings.facade'
import { GridStringsRepository } from './grid-strings.repository'

@Injectable({
  providedIn: 'root',
})
export class GridStringsStoreService {
  public select = inject(GridStringsFacade)
  public dispatch = inject(GridStringsRepository)
}
