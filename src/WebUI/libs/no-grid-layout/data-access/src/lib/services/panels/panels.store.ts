import { Injectable } from '@angular/core'
import { ComponentStore } from '@ngrx/component-store'
import { FreePanelModel } from '@no-grid-layout/shared'

interface PanelsState {
  panels: FreePanelModel[];
}

@Injectable({
  providedIn: 'root',
})
export class PanelsStore
  extends ComponentStore<PanelsState> {

  panels$ = this.select((state) => state.panels)



  addPanel = this.updater((state, panel: FreePanelModel) => ({
    ...state,
    panels: [...state.panels, panel],
  }))

  updatePanel = this.updater((state, panel: FreePanelModel) => ({
      ...state,
      panels: [
        ...state.panels.map((p) => p.id === panel.id
          ? panel
          : p),
      ],
    }
  ))
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

  removePanel = this.updater((state, panel: FreePanelModel) => ({
      ...state,
      panels: [...state.panels.filter((p) => p.id !== panel.id)],
    }
  ))

  panelById$ = (id: string) => this.select((state) => state.panels.find((p) => p.id === id))

  constructor() {
    super({
      panels: [],
    })
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
