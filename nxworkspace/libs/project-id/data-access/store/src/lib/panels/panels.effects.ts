import { inject, Injectable } from '@angular/core'
import { Actions } from '@ngrx/effects'

@Injectable({
  providedIn: 'root',
})
export class PanelsEffects {
  private actions$ = inject(Actions)
}
