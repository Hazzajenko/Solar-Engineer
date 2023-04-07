import { inject, Injectable } from '@angular/core'
import { BehaviorSubject, map, shareReplay } from 'rxjs'
import { FreePanelModel } from '@no-grid-layout/shared'
import { PanelsStore } from './panels.store'

@Injectable({
  providedIn: 'root',
})
export class FreePanelsService {
  private _freePanels: BehaviorSubject<FreePanelModel[]> = new BehaviorSubject<FreePanelModel[]>([])
  private _freePanels$ = this._freePanels.asObservable()
  private _panelsStore = inject(PanelsStore)

  getFreePanels$() {
    return this._freePanels$.pipe(
      shareReplay({ bufferSize: 1, refCount: true }),
    )
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
    // this._panelsStore.addPanel(freePanel)
    this._freePanels.next([...this._freePanels.value, freePanel])
  }

  deleteFreePanel(freePanel: FreePanelModel) {
    // this._panelsStore.removePanel(freePanel)
    this._freePanels.next(this._freePanels.value.filter((fp) => fp.id !== freePanel.id))
  }

  updateFreePanel(freePanel: FreePanelModel) {
    // this._panelsStore.updatePanel(freePanel)
    const freePanels = this._freePanels.value
    const index = freePanels.findIndex((fp) => fp.id === freePanel.id)
    if (index === -1) {
      console.error('freePanel not found', freePanel)
      // this._logger.warn('freePanel not found', freePanel)
      return
    }
    freePanels[index] = freePanel
    this._freePanels.next(freePanels)
    console.log('updateFreePanel', freePanel)

    // this._logger.debug('updateFreePanel', freePanel)
  }

  updatePanelById(id: string, update: Partial<FreePanelModel>) {
    // this._panelsStore.updatePanelById(id, update)
    /*    const newy {
     ...this._panelsStore.panelById$(id),
     }*/

    const freePanels = this._freePanels.value
    const index = freePanels.findIndex((fp) => fp.id === id)
    if (index === -1) {
      console.error('freePanel not found', id)
      // this._logger.warn('freePanel not found', id)
      return
    }
    freePanels[index] = { ...freePanels[index], ...update }
    this._freePanels.next(freePanels)
    // this._logger.debug('updateFreePanel', id, update)
    console.log('updateFreePanel', id, update)
  }

  updateFreePanels(freePanels: FreePanelModel[]) {
    this._freePanels.next(freePanels)
  }

  clearFreePanels() {
    this._freePanels.next([])
  }
}