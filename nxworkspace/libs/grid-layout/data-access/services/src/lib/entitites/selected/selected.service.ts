import { inject, Injectable } from '@angular/core'
import {
  GridStoreService,
  PanelsStoreService,
  SelectedStoreService,
  StringsStoreService,
} from '@project-id/data-access/facades'
import { GridMode } from '@shared/data-access/models'

@Injectable({
  providedIn: 'root',
})
export class SelectedService {

  private gridStore = inject(GridStoreService)
  private selectedStore = inject(SelectedStoreService)
  private panelsStore = inject(PanelsStoreService)
  private stringsStore = inject(StringsStoreService)


  async selectString(stringId: string) {
    this.gridStore.dispatch.selectGridMode(GridMode.SELECT)
    const string = await this.stringsStore.select.stringById(stringId)
    if (!string) return
    const panels = await this.panelsStore.select.panelsByStringId(stringId)
    this.selectedStore.dispatch.selectString(string, panels)
  }

  async clearState() {
    this.selectedStore.dispatch.clearSelected()
    return
  }
}
