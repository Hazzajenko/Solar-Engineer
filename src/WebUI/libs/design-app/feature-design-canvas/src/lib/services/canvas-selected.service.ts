import { TypeOfEntity } from '@design-app/feature-selected'
import { inject, Injectable } from '@angular/core'
import { Store } from '@ngrx/store'
import { CanvasActions } from '../store'

@Injectable({
  providedIn: 'root',
})
export class CanvasSelectedService {
  private _store = inject(Store)

  private _selected: TypeOfEntity | undefined

  get selected() {
    return this._selected
  }

  private _multiSelected: TypeOfEntity[] = []

  get multiSelected() {
    return this._multiSelected
  }

  emitDraw = () => this._store.dispatch(CanvasActions.drawCanvas())

  setSelected(selected: TypeOfEntity) {
    if (this._selected?.id === selected.id) {
      this._selected = undefined
      console.log('set selected', undefined)
      return
    }
    this._selected = selected
    console.log('set selected', selected)
    this.emitDraw()
    // this.
    // this.emit(CanvasEvent.Draw)
  }

  setMultiSelected(multiSelected: TypeOfEntity[]) {
    this._multiSelected = multiSelected
    console.log('set multiSelected', multiSelected)
  }

  addToMultiSelected(selected: TypeOfEntity) {
    this._multiSelected.push(selected)
    console.log('add to multiSelected', selected)
  }

  removeFromMultiSelected(selected: TypeOfEntity) {
    const index = this._multiSelected.indexOf(selected)
    if (index > -1) {
      this._multiSelected.splice(index, 1)
    }
    console.log('remove from multiSelected', selected)
  }

  clearSelected() {
    this._selected = undefined
    this._multiSelected = []
    console.log('clear selected')
    this.emitDraw()
    // this.emit(CanvasEvent.Draw)
  }
}