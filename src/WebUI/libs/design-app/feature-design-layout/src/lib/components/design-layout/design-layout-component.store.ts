import { inject, Injectable } from '@angular/core'
import { ComponentStore } from '@ngrx/component-store'
import { PanelModel, PanelsStoreService } from '@design-app/feature-panel'
import { map, tap } from 'rxjs'
import { TypeOfEntity } from '@design-app/feature-selected'

export type DesignLayoutViewModel = {
  entities: TypeOfEntity[]
}
/*export const selectAllPanels = createSelector(selectPanelsState, (state: PanelsState) =>
 selectAll(state),
 )*/

/*const selectAllPanelsMapToTypeOfEntity = createSelector(selectAllPanels, (panels: PanelModel[]) =>
 panels.map((panel) => {
 return {
 id:   panel.id,
 type: panel.type,
 } as TypeOfEntity
 },
 ))*/

interface DesignLayoutComponentState {
  panels: PanelModel[]
}

@Injectable()
export class DesignLayoutComponentStore
  extends ComponentStore<DesignLayoutComponentState> {
  private _panelsStore = inject(PanelsStoreService)

  private _panels$ = this._panelsStore.select.panels$.pipe(
    tap((panels) => {
        this.patchState({ panels })
      },
    ),
    map((panels) => {
      return panels.map((panel) => {
          return {
            id:   panel.id,
            type: panel.type,
          } as TypeOfEntity
        },
      )
    }),
  )

  public vm$ = this.select({
    entities: this._panels$,
  })

  constructor() {
    super(<DesignLayoutComponentState>{})
  }
}
