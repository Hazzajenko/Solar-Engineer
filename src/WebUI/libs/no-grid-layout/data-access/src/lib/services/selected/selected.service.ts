import { inject, Injectable } from '@angular/core'
import { BehaviorSubject, Observable, shareReplay } from 'rxjs'
import { PanelStylerService } from '@no-grid-layout/utils'

@Injectable({
  providedIn: 'root',
})
export class SelectedService {
  private _selected$ = new BehaviorSubject<string | undefined>(undefined)
  private _multiSelected$ = new BehaviorSubject<string[]>([])
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

  get multiSelected$(): Observable<string[]> {
    return this._multiSelected$
      .asObservable()
      .pipe(
        shareReplay({ bufferSize: 1, refCount: true }),
      )
  }

  get multiSelected(): string[] {
    return this._multiSelected$.value
  }

  set multiSelected(value: string[]) {
    // this.selected = undefined
    this._selected$.next(undefined)
    this._multiSelected$.next(value)
  }

  setSelected(selectedId: string) {
    /*    const existingSelectedId = this._selected$.value
     if (existingSelectedId && existingSelectedId === selectedId) {
     this._selected$.next(undefined)
     return
     }
     if (existingSelectedId) {
     this._selected$.next(undefined)
     // this._panelStylerService.disableSelectedPanelClass(existingSelectedId)
     }*/
    this._selected$.next(selectedId)
    console.log('selected', this.selected)
    // this.logSelected()
  }

  clearSelected() {
    this._selected$.next(undefined)
  }

  private logSelected() {
    console.log('selected', this.selected)
  }

}