import { inject, Injectable } from '@angular/core'

import { StringsQueries } from './strings.queries'
import { StringsRepository } from './strings.repository'

@Injectable({
  providedIn: 'root',
})
export class StringsStoreService {
  public select = inject(StringsQueries)
  public dispatch = inject(StringsRepository)
}
