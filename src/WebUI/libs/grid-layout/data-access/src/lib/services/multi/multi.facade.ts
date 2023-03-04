import { inject, Injectable } from '@angular/core'
import { Store } from '@ngrx/store'
import { MultiSelectors } from '../../store'
import { firstValueFrom } from 'rxjs'

@Injectable({
  providedIn: 'root',
})
export class MultiFacade {
  private readonly store = inject(Store)

  state$ = this.store.select(MultiSelectors.selectMultiState)
  type$ = this.store.select(MultiSelectors.selectMultiType)
  start$ = this.store.select(MultiSelectors.selectMultiCreateStartLocation)
  finish$ = this.store.select(MultiSelectors.selectMultiCreateFinishLocation)

  get state() {
    return firstValueFrom(this.state$)
  }
}
