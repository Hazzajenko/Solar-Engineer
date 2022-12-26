import { SelectedFacade } from '@project-id/data-access/store';
import { firstValueFrom } from 'rxjs';
import { inject, Injectable } from '@angular/core'
import { BlocksFacade, GridState, PanelsFacade } from '@project-id/data-access/store'
import { BlockType, PanelModel, TypeModel } from '@shared/data-access/models'

@Injectable({
  providedIn: 'root',
})
export class CreateService {
  private panelsFacade = inject(PanelsFacade)
  private blocksFacade = inject(BlocksFacade)
  private selectedFacade = inject(SelectedFacade)

  createSwitch(location: string, gridState: GridState) {
    switch (gridState.createMode) {
      case TypeModel.PANEL:
        return this.createPanelForGrid(location)

      case TypeModel.TRAY:
        // return this.createTrayForGrid(location)
        break
      default:
        break
    }
  }

  createSwitchV2(location: string, gridState: GridState) {
    switch (gridState.createMode) {
      case TypeModel.PANEL:
        return this.createPanelForGrid(location)

/*       case TypeModel.TRAY:
        // return this.createTrayForGrid(location)
        break */
      default:
        return
    }
  }

  async createPanelForGrid(location: string) {
/*     const [selected, projectID] = await firstValueFrom(
      this.store
        .select(selectSelectedUnitAndIds)
        .pipe(combineLatestWith(this.store.select(selectCurrentProjectId))),
    ) */
    const selected = await firstValueFrom(this.selectedFacade.selectedStringId$)
    if (childBlock) {
      if (!selected.singleSelectId && selected.type !== TypeModel.STRING) {
        const panelRequest = new PanelModel(projectID, location, 'undefined', 0)

        this.panelsEntity.add(panelRequest)
      } else if (selected.singleSelectId && selected.type === TypeModel.STRING) {
        const panelRequest = new PanelModel(projectID, location, selected.selectedStringId!, 0)

        this.panelsEntity.add(panelRequest)
      }
    } else {
      if (!selected.singleSelectId && selected.type !== TypeModel.STRING) {
        const panelRequest = new PanelModel(projectID, location, 'undefined', 0)

        this.panelsEntity.add(panelRequest)
      } else if (selected.singleSelectId && selected.type === TypeModel.STRING) {
        const panelRequest = new PanelModel(projectID, location, selected.selectedStringId!, 0)

        this.panelsEntity.add(panelRequest)
      }
    }
  }

  createPanelForGridV2(projectId: number, location: string, selectedStringId?: string) {
    const panelRequest = new PanelModel({projectId, stringId: selectedStringId ? selectedStringId : 'undefined', location, rotation: 0, type: BlockType.PANEL})
/*           if (!selectedStringId) {
            const panelRequest = new PanelModel(projectID, location, 'undefined', 0)
            const panelRequest = new PanelModel({projectId, stringId})

            this.panelsEntity.add(panelRequest)
          } else if (selected.singleSelectId && selected.type === TypeModel.STRING) {
            const panelRequest = new PanelModel(projectID, location, selected.selectedStringId!, 0)

            this.panelsEntity.add(panelRequest)
          } */
      }
}
