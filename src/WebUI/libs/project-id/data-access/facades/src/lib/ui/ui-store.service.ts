import { inject, Injectable } from '@angular/core'

import { UiFacade } from './ui.facade'
import { UiRepository } from './ui.repository'


@Injectable({
  providedIn: 'root',
})
export class UiStoreService {
  public select = inject(UiFacade)
  public dispatch = inject(UiRepository)
}
