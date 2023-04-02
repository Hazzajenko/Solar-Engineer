import { Injectable } from '@angular/core'
import { BehaviorSubject, map, shareReplay } from 'rxjs'
import { FreePanelModel } from '@no-grid-layout/shared'
import { Logger } from 'tslog'

@Injectable({
  providedIn: 'root',
})
export class NoGridLayoutService {
  private _freePanels: BehaviorSubject<FreePanelModel[]> = new BehaviorSubject<FreePanelModel[]>([])
  private _freePanels$ = this._freePanels.asObservable()
  private _logger = new Logger({ name: 'no-grid-layout.service' })

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
    this._freePanels.next([...this._freePanels.value, freePanel])
  }

  deleteFreePanel(freePanel: FreePanelModel) {
    this._freePanels.next(this._freePanels.value.filter((fp) => fp.id !== freePanel.id))
  }

  updateFreePanel(freePanel: FreePanelModel) {
    const freePanels = this._freePanels.value
    const index = freePanels.findIndex((fp) => fp.id === freePanel.id)
    if (index === -1) {
      this._logger.warn('freePanel not found', freePanel)
      return
    }
    freePanels[index] = freePanel
    this._freePanels.next(freePanels)
    this._logger.debug('updateFreePanel', freePanel)
  }

  updatePanelById(id: string, update: Partial<FreePanelModel>) {
    const freePanels = this._freePanels.value
    const index = freePanels.findIndex((fp) => fp.id === id)
    if (index === -1) {
      this._logger.warn('freePanel not found', id)
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