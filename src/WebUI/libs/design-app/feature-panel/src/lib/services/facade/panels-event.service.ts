import { inject, Injectable } from '@angular/core'
import { PanelsStoreService } from '../'
import { Point, UndefinedString } from '@shared/data-access/models'
import { SelectedStoreService } from '@design-app/feature-selected'
import { PanelFactory, PanelRotation } from '../../types'

@Injectable({
  providedIn: 'root',
})
export class PanelsEventService {
  // private projectsFacade = inject(ProjectsFacade)
  private _panelsStore = inject(PanelsStoreService)
  private _selectedStore = inject(SelectedStoreService)

  // private authStore = inject(AuthStoreService)

  async createPanel(location: Point, stringId: string = UndefinedString, rotation: PanelRotation = PanelRotation.Default) {
    const panel = PanelFactory.create(location, stringId, rotation)
    this._panelsStore.dispatch.addPanel(panel)
    this._selectedStore.dispatch.clearSelectedState()
    return
  }

  /*async selectPanel(panel: GridPanelModel, shiftKey: boolean) {
   const selectedStringId = await this._selectedStore.select.selectedStringId

   const links = await this.linksStore.select.allLinks
   const panelLink = getSelectedLinks(links, panel.id)

   if (selectedStringId && selectedStringId === panel.stringId) {
   await this._selectedStore.dispatch.selectPanelWhenStringSelected(panel.id, panelLink)
   await this.pathsFactory.setSelectedPanelPaths(panel.id)
   // await this.pathsFactory.clearSelectedPanelPaths()
   return
   }

   if (shiftKey) {
   this._selectedStore.dispatch.addPanelToMultiSelect(panel.id)
   await this.pathsFactory.setSelectedPanelPaths(panel.id)
   await this.pathsStore.dispatch.clearSelectedPanelPaths()
   return
   }

   await this._selectedStore.dispatch.selectPanel(panel.id, panelLink)
   await this.pathsFactory.setSelectedPanelPaths(panel.id)
   await this.pathsStore.dispatch.clearSelectedPanelPaths()
   return
   }

   async updatePanel(panelId: string, changes: Partial<GridPanelModel>) {
   const project = await this.projectsFacade.selectedProject()
   const update: ProjectItemUpdate<GridPanelModel> = {
   id:        panelId,
   projectId: project.id,
   changes,
   }
   this._panelsStore.dispatch.updatePanel(update)

   return
   }

   async rotateSelectedPanels(rotation: number) {
   const selectedPanelIds = await firstValueFrom(
   combineLatest([
   this._selectedStore.select.multiSelectIds$,
   this._panelsStore.select.allPanels$,
   ])
   .pipe(
   map(([multiSelectIds, panels]) =>
   panels.filter((p) => multiSelectIds?.includes(p.id))
   .map((panels) => panels.id),
   ),
   ),
   )
   const updates = toUpdatePanelArray(selectedPanelIds, { rotation })

   this._panelsStore.dispatch.updateManyPanels(updates)

   // return this.eventFactory.action({ action: 'UPDATE_PANEL', data: { update } })
   }

   async deletePanel(panelId: string) {
   this._panelsStore.dispatch.deletePanel(panelId)
   return
   }*/
}
