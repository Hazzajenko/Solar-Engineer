import { inject, Injectable } from '@angular/core'

import { SelectedFacade } from './selected.facade'
import { SelectedRepository } from './selected.repository'


@Injectable({
  providedIn: 'root',
})
export class SelectedStoreService {
  public select = inject(SelectedFacade)
  public dispatch = inject(SelectedRepository)
}
