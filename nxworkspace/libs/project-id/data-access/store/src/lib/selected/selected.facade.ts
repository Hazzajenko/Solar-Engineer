import { inject, Injectable } from '@angular/core'
import { Store } from '@ngrx/store'

import * as SelectedSelectors from './selected.selectors'

@Injectable({
  providedIn: 'root'
})
export class SelectedFacade {
  private readonly store = inject(Store)

  selectedStringId$ = this.store.select(SelectedSelectors.selectSelectedStringId)
}
