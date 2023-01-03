import { inject, Injectable } from '@angular/core'
import { Store } from '@ngrx/store'
import { UiActions, UiSelectors } from '@project-id/data-access/store'
import { firstValueFrom } from 'rxjs'

@Injectable({
  providedIn: 'root',
})
export class UiFacade {
  private store = inject(Store)

  keymap$ = this.store.select(UiSelectors.selectIsKeymapEnabled)


  get keymap() {
    return firstValueFrom(this.keymap$)
  }

  toggleKeymap() {
    this.store.dispatch(UiActions.toggleKeymap())
  }

  turnKeymapOn() {
    this.store.dispatch(UiActions.turnKeymapOn())
  }

  turnKeymapOff() {
    this.store.dispatch(UiActions.turnKeymapOff())
  }
}
