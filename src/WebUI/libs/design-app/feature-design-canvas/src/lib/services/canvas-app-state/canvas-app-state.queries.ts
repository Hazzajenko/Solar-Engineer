import { inject, Injectable } from '@angular/core'
import { select, Store } from '@ngrx/store'
import { tap } from 'rxjs'
import { CanvasAppState, initialCanvasAppState } from '@design-app/feature-design-canvas'
import { selectCanvasAppStateState } from '../../store'

@Injectable({
  providedIn: 'root',
})
export class CanvasAppStateQueries {
  private readonly _store = inject(Store)
  private readonly _state$ = this._store.pipe(select(selectCanvasAppStateState))
  private _state: CanvasAppState = initialCanvasAppState

  public get state$() {
    return this._state$.pipe(
      tap((state) => {
          this._state = state
        },
      ),
    )
  }

  public get state() {
    return this._state
  }

}
