import { Injectable } from '@angular/core'
import { Actions } from '@ngrx/effects'
import { Store } from '@ngrx/store'
import { AppState } from '../../../../../store/app.state'

@Injectable()
export class BlocksEntityEffects {
  constructor(private actions$: Actions, private store: Store<AppState>) {}
}
