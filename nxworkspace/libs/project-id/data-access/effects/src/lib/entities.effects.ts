import { inject, Injectable } from '@angular/core'
import { Actions } from '@ngrx/effects'

@Injectable()
export class EntitiesEffects {
  private actions$ = inject(Actions)
}
