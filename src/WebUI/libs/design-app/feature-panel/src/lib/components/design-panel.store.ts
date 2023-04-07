import { inject, Injectable } from '@angular/core'
import { ComponentStore } from '@ngrx/component-store'
import { SelectedService } from '@no-grid-layout/data-access'
import { combineLatest, map, Observable, switchMap, tap } from 'rxjs'
import { DesignPanelsFacade } from '../store'
import { DesignPanelFactory, DesignPanelModel, PanelRotation, SelectedPanelState } from '../types'

interface DesignPanelComponentState {
  panel: DesignPanelModel
}

@Injectable()
export class DesignPanelStore
  extends ComponentStore<DesignPanelComponentState> {
  private _designPanelsFacade = inject(DesignPanelsFacade)
  private _selectedService = inject(SelectedService)
  private _panelId!: string
  private _rotation!: PanelRotation

  panel$ = this.select((state) => state.panel)
  initPanel = this.effect<{
    panelId: string
  }>((params$) => {
    return params$.pipe(
      tap((params) => {
        this._panelId = params.panelId
      }),
      switchMap((params) => {
        return this._designPanelsFacade.panelById$(params.panelId)
          .pipe(
            tap(
              (panel) => {
                if (!panel) {
                  throw new Error(`Panel with id ${params.panelId} not found`)
                }
                console.log('initPanel panel', panel)
                this.patchState({
                  panel,
                })
                this._rotation = panel.rotation
              },
            ),
          )
      }),
    )
  })

  selected$: Observable<SelectedPanelState> = this.select((state) => state)
    .pipe(
      switchMap(() => {
          return combineLatest([
            this._selectedService.selected$,
            this._selectedService.multiSelected$,
          ])
            .pipe(
              map(([selected, multiSelected]) => {
                if (selected === this._panelId) {
                  return SelectedPanelState.SingleSelected
                }
                if (multiSelected.find((selected) => selected.includes(this._panelId))) {
                  return SelectedPanelState.MultiSelected
                }
                return SelectedPanelState.NoneSelected
              }),
            )
        },
      ),
      tap((selected) => {
          console.log('initSelected selected', selected)
        },
      ),
    )

  updatePanel = (changes: Partial<DesignPanelModel>) => this._designPanelsFacade.updatePanel({
    id: this._panelId,
    changes,
  })

  rotatePanel = () => {
    const rotation = DesignPanelFactory.oppositeRotation(this._rotation)
    this._designPanelsFacade.updatePanel({ id: this._panelId, changes: { rotation } })
  }

  deletePanel = () => this._designPanelsFacade.deletePanel(this._panelId)

  constructor() {
    super(<DesignPanelComponentState>{})
  }
}
