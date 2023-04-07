import { Injectable } from '@angular/core'
import { BehaviorSubject, Observable, shareReplay } from 'rxjs'
import { DirectionNearbySelection } from './direction-nearby-selection'

@Injectable({
  providedIn: 'root',
})
export class SelectedService {
  private _selected$ = new BehaviorSubject<string | undefined>(undefined)
  private _multiSelected$ = new BehaviorSubject<string[]>([])
  private _directionNearbySelection = new BehaviorSubject<DirectionNearbySelection[]>([])

  get directionNearbySelection$(): Observable<DirectionNearbySelection[]> {
    return this._directionNearbySelection
      .asObservable()
      .pipe(
        shareReplay({ bufferSize: 1, refCount: true }),
      )
  }

  get directionNearbySelection(): DirectionNearbySelection[] {
    return this._directionNearbySelection.value
  }

  private set directionNearbySelection(value: DirectionNearbySelection[]) {
    this._directionNearbySelection.next(value)
  }

  // private _panelStylerService = inject(PanelStylerService)

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

  public addMultiSelected(id: string) {
    const multiSelected = this.multiSelected
    if (multiSelected.includes(id)) {
      return
    }
    multiSelected.push(id)
    this.multiSelected = multiSelected
  }

  public removeMultiSelected(id: string) {
    const multiSelected = this.multiSelected
    const index = multiSelected.indexOf(id)
    if (index === -1) {
      return
    }
    multiSelected.splice(index, 1)
    this.multiSelected = multiSelected
  }

  public clearMultiSelected() {
    this.multiSelected = []
  }

  public addDirectionNearbySelection(directionNearbySelection: DirectionNearbySelection) {
    const directionNearbySelections = this.directionNearbySelection
    if (directionNearbySelections.find(d => d.id === directionNearbySelection.id)) {
      return
    }
    /*    if (directionNearbySelections.includes(directionNearbySelection)) {
     return
     }*/
    directionNearbySelections.push(directionNearbySelection)
    this.directionNearbySelection = directionNearbySelections
  }

  public removeDirectionNearbySelection(directionNearbySelection: DirectionNearbySelection) {
    const directionNearbySelections = this.directionNearbySelection
    const index = directionNearbySelections.indexOf(directionNearbySelection)
    if (index === -1) {
      return
    }
    directionNearbySelections.splice(index, 1)
    this.directionNearbySelection = directionNearbySelections
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