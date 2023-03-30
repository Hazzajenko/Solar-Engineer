import { Injectable } from '@angular/core'
import { BehaviorSubject, map } from 'rxjs'
import { FreePanelModel } from '@no-grid-layout/feature'

// import { map } from 'zod'

@Injectable({
  providedIn: 'root',
})
export class NoGridLayoutService {
  private _freePanels: BehaviorSubject<FreePanelModel[]> = new BehaviorSubject<FreePanelModel[]>([])
  private _freePanels$ = this._freePanels.asObservable()
  panelsHaveClass: Record<string, string> = {}
  private _panelClasses: BehaviorSubject<Record<string, string>> = new BehaviorSubject<Record<string, string>>({})
  private _panelClasses$ = this._panelClasses.asObservable()

  getClassesForPanel$(id: string) {
    return this._panelClasses$.pipe(
      map((classes) => classes[id]),
    )
  }

  setClassForPanel(id: string, className: string) {
    // console.log('setClassForPanel', id, className)
    this._panelClasses.next({
      ...this._panelClasses.value,
      [id]: className,
    })
  }

  clearClassesForPanel() {
    // const panelClasses = this._panelClasses.value
    // delete panelClasses[id]
    // this._panelClasses.next(panelClasses)
    this._panelClasses.next({})
  }

  getFreePanels() {
    return this._freePanels$
  }

  getPanelById(id: string) {
    return this._freePanels$.pipe(
      map((freePanels) => freePanels.find((fp) => fp.id === id)),
    )
  }

  getPanelById2(id: string) {
    return this._freePanels.value.find((fp) => fp.id === id)
  }

  addFreePanel(freePanel: FreePanelModel) {
    // freePanel.border = 'border border-black'
    // freePanel.border = '1px solid #95c2fa'
    this._freePanels.next([...this._freePanels.value, freePanel])
  }

  givePanelClass(freePanel: FreePanelModel, className: string) {
    this.panelsHaveClass[freePanel.id] = className
  }

  removeFreePanel(freePanel: FreePanelModel) {
    this._freePanels.next(this._freePanels.value.filter((fp) => fp.id !== freePanel.id))
  }

  updateFreePanel(freePanel: FreePanelModel) {
    const freePanels = this._freePanels.value
    const index = freePanels.findIndex((fp) => fp.id === freePanel.id)
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