import { inject, Injectable } from '@angular/core'
import { select, Store } from '@ngrx/store'
import { firstValueFrom, Observable } from 'rxjs'
import { Dictionary } from '@ngrx/entity'
import { PanelModel } from '@design-app/feature-panel'
import { selectAllPanels, selectPanelEntityById, selectPanelsByIdArray, selectPanelsEntities } from '../../store/panels.selectors'

@Injectable({
  providedIn: 'root',
})
export class PanelsQueries {
  private readonly _store = inject(Store)
  private readonly _panelEntities$: Observable<Dictionary<PanelModel>> = this._store.pipe(select((selectPanelsEntities)))
  private readonly _panels$: Observable<PanelModel[]> = this._store.pipe(select((selectAllPanels)))

  public get panelEntities$() {
    return this._panelEntities$
  }

  public get panels$() {
    return this._panels$
  }

  public panelById$(id: string) {
    return this._store.pipe(select(selectPanelEntityById({ id })))
  }

  public panelById(id: string) {
    return firstValueFrom(this.panelById$(id))
  }

  public panelsByIdArray$(ids: string[]) {
    return this._store.pipe(select(selectPanelsByIdArray({ ids })))
  }

  public panelsByIdArray(ids: string[]) {
    return firstValueFrom(this._store.pipe(select(selectPanelsByIdArray({ ids }))))
  }

  /*  public panelsByStringId$(stringId: string) {
   return this._store.select(PanelsSelectors.selectPanelsByStringId({ stringId }))
   }

   panelsByStringId(stringId: string) {
   return firstValueFrom(this._store.select(PanelsSelectors.selectPanelsByStringId({ stringId })))
   }

   selectStringIdByPanelId$(panelId: string) {
   return this._store.select(PanelsSelectors.selectStringIdByPanelId({ panelId }))
   }*/
}
