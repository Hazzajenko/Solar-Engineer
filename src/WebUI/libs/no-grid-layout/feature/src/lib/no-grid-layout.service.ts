import { Injectable } from '@angular/core'
import { BehaviorSubject, map } from 'rxjs'
import { FreePanelModel } from './free-panel.model'

@Injectable({
  providedIn: 'root',
})
export class NoGridLayoutService {
  private _freePanels: BehaviorSubject<FreePanelModel[]> = new BehaviorSubject<FreePanelModel[]>([])
  private _freePanels$ = this._freePanels.asObservable()

  getFreePanels$() {
    return this._freePanels$
  }

  getPanelById$(id: string) {
    return this._freePanels$.pipe(
      map((freePanels) => freePanels.find((fp) => fp.id === id)),
    )
  }

  getPanelById(id: string) {
    return this._freePanels.value.find((fp) => fp.id === id)
  }

  addFreePanel(freePanel: FreePanelModel) {
    this._freePanels.next([...this._freePanels.value, freePanel])
  }

  deleteFreePanel(freePanel: FreePanelModel) {
    this._freePanels.next(this._freePanels.value.filter((fp) => fp.id !== freePanel.id))
  }

  updateFreePanel(freePanel: FreePanelModel) {
    console.log('updateFreePanel', freePanel)
    const freePanels = this._freePanels.value
    const index = freePanels.findIndex((fp) => fp.id === freePanel.id)
    if (index === -1) {
      console.log('freePanel not found', freePanel)
      return
    }
    freePanels[index] = freePanel
    this._freePanels.next(freePanels)
  }

  updateFreePanels(freePanels: FreePanelModel[]) {
    this._freePanels.next(freePanels)
  }

  clearFreePanels() {
    this._freePanels.next([])
  }
}