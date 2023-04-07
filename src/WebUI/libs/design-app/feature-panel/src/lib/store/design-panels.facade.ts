import { inject, Injectable } from '@angular/core'
import { firstValueFrom, Observable } from 'rxjs'
import { select, Store } from '@ngrx/store'
import { Dictionary } from '@ngrx/entity'
import { DesignPanelsActions } from './design-panels.actions'
import { selectAllDesignPanels, selectDesignPanelEntityById, selectDesignPanelsByIdArray, selectDesignPanelsEntities } from './design-panels.selectors'
import { DesignPanelModel } from '../types'
import { UpdateStr } from '@ngrx/entity/src/models'

@Injectable({
  providedIn: 'root',
})
export class DesignPanelsFacade {
  private readonly _store = inject(Store)
  private readonly _panelEntities$: Observable<Dictionary<DesignPanelModel>> = this._store.pipe(select((selectDesignPanelsEntities)))
  private readonly _panels$: Observable<DesignPanelModel[]> = this._store.pipe(select((selectAllDesignPanels)))

  public get panelEntities$() {
    return this._panelEntities$
  }

  public get panels$() {
    return this._panels$
  }

  public panelById$(id: string) {
    return this._store.pipe(select(selectDesignPanelEntityById({ id })))
  }

  public panelsByIdArray$(ids: string[]) {
    return this._store.pipe(select(selectDesignPanelsByIdArray({ ids })))
  }

  public async panelsByIdArray(ids: string[]) {
    return firstValueFrom(this._store.pipe(select(selectDesignPanelsByIdArray({ ids }))))
  }

  public addPanel(freePanel: DesignPanelModel) {
    this._store.dispatch(DesignPanelsActions.addPanel({ panel: freePanel }))
  }

  public updatePanel(update: UpdateStr<DesignPanelModel>) {
    this._store.dispatch(DesignPanelsActions.updatePanel({ update }))
  }

  public updateManyPanels(updates: UpdateStr<DesignPanelModel>[]) {
    this._store.dispatch(DesignPanelsActions.updateManyPanels({ updates }))
  }

  public deletePanel(id: string) {
    this._store.dispatch(DesignPanelsActions.deletePanel({ panelId: id }))
  }

}