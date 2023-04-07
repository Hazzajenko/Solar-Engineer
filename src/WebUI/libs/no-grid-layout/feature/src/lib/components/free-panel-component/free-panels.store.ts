import { inject, Injectable } from '@angular/core'
import { ComponentStore, tapResponse } from '@ngrx/component-store'
import { FreePanelsFacade, FreePanelsService } from '@no-grid-layout/data-access'
import { FreePanelModel } from '@no-grid-layout/shared'
import { switchMap, tap } from 'rxjs'

interface FreePanelsState {
  panel: FreePanelModel;
}

@Injectable()
export class FreePanelsStore
  extends ComponentStore<FreePanelsState> {
  private _freePanelsService = inject(FreePanelsService)
  private _freePanelsFacade = inject(FreePanelsFacade)
  private _panelId!: string

  // panel$ = this.select((state) => state.panel)
  panel$ = this.select((state) => state.panel)
  initPanel = this.effect<{
    panelId: string
  }>((params$) => {
    return params$.pipe(
      tap((params) => {
        console.log('initPanel params', params)
        this._panelId = params.panelId
        /*        this.patchState({
         panel: this._freePanelsService.getPanelById(params.panelId)
         })*/
      }),
      switchMap((params) => {
        // return this._freePanelsService.getPanelById$(params.panelId)
        return this._freePanelsFacade.freePanelById$(params.panelId)
          .pipe(
            tapResponse(
              (panel) => {
                console.log('initPanel panel', panel)
                this.patchState({
                  panel,
                })
              },
              (error) => {
                console.error('error', error)
              },
            ),
          )
      }),
    )
  })

  updatePanel = (changes: Partial<FreePanelModel>) => this._freePanelsFacade.updateFreePanel(this._panelId, changes)

  /*  updatePanel = this.updater((state, panel: FreePanelModel) => ({
   ...state,
   panel,
   }))*/

  /*  updatePanel = this.effect((changes: Partial<FreePanelModel>) => {
   return this._freePanelsFacade.updateFreePanel(this._panelId, changes)
   /!*      .pipe(
   tapResponse(
   (panel) => {
   console.log('updatePanel panel', panel)
   this.patchState({
   panel,
   })
   },
   (error) => {
   console.error('error', error)
   },
   ),
   )*!/
   })*/
  /*  initPanel = this.effect((panelId$: string) => {
   return this._freePanelsService.getPanelById$(panelId$)

   /!*  return this._freePanelsService.getPanel(panelId$).pipe(
   this.updatePanel
   )*!/
   })*/

  /*  updatePanel = this.updater((state, panel: FreePanelModel) => ({
   ...state,
   panels: [
   ...state.panels.map((p) => p.id === panel.id
   ? panel
   : p),
   ],
   }
   ))*/
  /*
   updatePanelById = this.updater((state: PanelsState, id: string, update: Partial<FreePanelModel>) => ({
   ...state,
   panels: [
   ...state.panels.map((p) => p.id === id
   ? {
   ...p,
   ...update,
   }
   : p
   ],
   })
   )*/

  /*
   removePanel = this.updater((state, panel: FreePanelModel) => ({
   ...state,
   panels: [...state.panels.filter((p) => p.id !== panel.id)],
   }
   ))

   panelById$ = (id: string) => this.select((state) => state.panels.find((p) => p.id === id))*/

  constructor() {
    super(<FreePanelsState>{})
  }

  /*


   setLoading = this.updater((state, permalink: string) => ({
   ...state,
   currentlyLoadingGifs: [...state.currentlyLoadingGifs, permalink],
   }));

   setLoadingComplete = this.updater((state, permalinkToComplete: string) => ({
   ...state,
   loadedGifs: [...state.loadedGifs, permalinkToComplete],
   currentlyLoadingGifs: [
   ...state.currentlyLoadingGifs.filter(
   (permalink) => permalink !== permalinkToComplete
   ),
   ],
   }));*/

}
