import { inject, Injectable } from '@angular/core'
import { BehaviorSubject, Observable, shareReplay } from 'rxjs'
import { PanelStylerService } from '@no-grid-layout/utils'

@Injectable({
  providedIn: 'root',
})
export class SelectedService {
  private _selected$ = new BehaviorSubject<string | undefined>(undefined)
  private _panelStylerService = inject(PanelStylerService)

  get selected$(): Observable<string | undefined> {
    return this._selected$
      .asObservable()
      .pipe(
        shareReplay({ bufferSize: 1, refCount: true }),
      )
  }

  get selected(): string | undefined {
    return this._selected$.value
  }

  setSelected(selectedId: string) {
    const existingSelectedId = this._selected$.value
    if (existingSelectedId && existingSelectedId === selectedId) {
      this.clearSelected()
      return
    }
    if (existingSelectedId) {
      this.clearSelected()
      // this._panelStylerService.disableSelectedPanelClass(existingSelectedId)
    }
    this._selected$.next(selectedId)
    this.logSelected()
  }

  clearSelected() {
    this._selected$.next(undefined)
  }

  private logSelected() {
    console.log('selected', this.selected)
  }

}