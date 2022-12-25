import { inject, Injectable } from '@angular/core'
import { Actions } from '@ngrx/effects'

@Injectable()
export class LinksEffects {
  private actions$ = inject(Actions)
}
