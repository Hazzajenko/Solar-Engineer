import { inject, Injectable } from '@angular/core'
import { Actions } from '@ngrx/effects'

@Injectable()
export class BlocksEffects {
  private actions$ = inject(Actions)
}
