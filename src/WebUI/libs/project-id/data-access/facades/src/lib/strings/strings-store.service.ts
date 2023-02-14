import { inject, Injectable } from '@angular/core'

import { StringsFacade } from './strings.facade'
import { StringsRepository } from './strings.repository'


@Injectable({
  providedIn: 'root',
})
export class StringsStoreService {
  public select = inject(StringsFacade)
  public dispatch = inject(StringsRepository)
}
