import { inject, Injectable } from '@angular/core'
import { select, Store } from '@ngrx/store'
import { firstValueFrom, Observable } from 'rxjs'
import { Dictionary } from '@ngrx/entity'
import { DesignPanelModel } from '@design-app/feature-panel'
import { selectAllDesignPanels, selectDesignPanelEntityById, selectDesignPanelsByIdArray, selectDesignPanelsEntities } from '../../store/design-panels.selectors'

@Injectable({
  providedIn: 'root',
})
export class PanelsQueries {
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

  public panelById(id: string) {
    return firstValueFrom(this.panelById$(id))
  }

  public panelsByIdArray$(ids: string[]) {
    return this._store.pipe(select(selectDesignPanelsByIdArray({ ids })))
  }

  public panelsByIdArray(ids: string[]) {
    return firstValueFrom(this._store.pipe(select(selectDesignPanelsByIdArray({ ids }))))
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
