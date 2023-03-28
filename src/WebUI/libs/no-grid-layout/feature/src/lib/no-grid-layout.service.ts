import { Injectable } from '@angular/core'
import { BehaviorSubject } from 'rxjs'
import { FreePanelModel } from '@no-grid-layout/feature'

@Injectable({
  providedIn: 'root',
})
export class NoGridLayoutService {
  private _freePanels: BehaviorSubject<FreePanelModel[]> = new BehaviorSubject<FreePanelModel[]>([])
  private _freePanels$ = this._freePanels.asObservable()

  getFreePanels() {
    return this._freePanels$
  }

  addFreePanel(freePanel: FreePanelModel) {
    this._freePanels.next([...this._freePanels.value, freePanel])
  }
}