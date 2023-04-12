import { inject, Injectable } from '@angular/core'
import { ComponentStore } from '@ngrx/component-store'
import { Observable, tap } from 'rxjs'
import { PanelFactory, PanelModel, PanelRotation } from '../types'
import { SelectedStoreService } from '@design-app/feature-selected'
import { throwIfNull$ } from '@shared/utils'
import { XyLocation } from '@shared/data-access/models'
import { PanelsStoreService } from '../services'

interface PanelComponentState {
  panel: PanelModel
}

@Injectable()
export class PanelComponentStore
  extends ComponentStore<PanelComponentState> {
  private _panelsStore = inject(PanelsStoreService)
  // private _designPanelsFacade = inject(DesignPanelsFacade)
  private _selectedStore = inject(SelectedStoreService)
  private _panelId!: string
  private _rotation!: PanelRotation
  private _location!: XyLocation

  rotatePanel$ = this.effect((rotation$: Observable<PanelRotation>) => {
      return rotation$.pipe(
        tap((rotation) => {
          this._rotation = rotation
          this.updatePanel({ rotation })
        }),
      )
    },
  )

  public vm$ = (panelId: string) => this.select({
    panel:    this._panel$(panelId),
    selected: this._selectedStore.select.selectedPanelState$(panelId),
  })

  private _panel$ = (panelId: string) => this._panelsStore.select.panelById$(panelId)
    .pipe(
      throwIfNull$(),
      tap((panel) => {
        this._panelId = panel.id
        this._rotation = panel.rotation
        this._location = panel.location
      }),
    )

  updatePanel = (changes: Partial<PanelModel>) => this._panelsStore.dispatch.updatePanel({
    id: this._panelId,
    changes,
  })

  rotatePanel = () => {
    const rotation = PanelFactory.oppositeRotation(this._rotation)
    this._panelsStore.dispatch.updatePanel({ id: this._panelId, changes: { rotation } })
  }

  deletePanel = () => this._panelsStore.dispatch.deletePanel(this._panelId)

  constructor() {
    super(<PanelComponentState>{})
  }
}