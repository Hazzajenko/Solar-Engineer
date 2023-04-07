import { inject, Injectable } from '@angular/core'
import { Observable } from 'rxjs'
import { FreePanelModel } from '@no-grid-layout/shared'
import { select, Store } from '@ngrx/store'
import { Dictionary } from '@ngrx/entity'
import { FreePanelsActions } from './free-panels.actions'
import { selectFreePanelEntityById, selectFreePanelsEntities } from './free-panels.selectors'

@Injectable({
  providedIn: 'root',
})
export class FreePanelsFacade {
  private readonly _store = inject(Store)
  private readonly _freePanels$: Observable<Dictionary<FreePanelModel>> = this._store.pipe(select((selectFreePanelsEntities)))

  public get freePanels$() {
    return this._freePanels$
  }

  public freePanelById$(id: string) {
    return this._store.pipe(select(selectFreePanelEntityById({ id })))
  }

  public addFreePanel(freePanel: FreePanelModel) {
    this._store.dispatch(FreePanelsActions.addPanel({ panel: freePanel }))
  }

  public updateFreePanel(id: string, changes: Partial<FreePanelModel>) {
    this._store.dispatch(FreePanelsActions.updatePanel({ update: { id, changes } }))
  }

  public deleteFreePanel(id: string) {
    this._store.dispatch(FreePanelsActions.deletePanel({ panelId: id }))
  }

}