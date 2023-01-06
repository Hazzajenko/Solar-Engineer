import { Directive, HostListener, inject } from '@angular/core'
import { GridFactory, MultiFactory, SelectedFactory, StringsFactory } from '@grid-layout/data-access/services'

import {
  GlobalFacade,
  GridFacade, GridStoreService, LinksStoreService,
  MultiFacade, MultiStoreService,
  PanelsFacade, PanelsStoreService,
  SelectedFacade, SelectedStoreService,
  StringsFacade,
} from '@project-id/data-access/facades'
import { GridMode } from '@shared/data-access/models'
import { firstValueFrom } from 'rxjs'

@Directive({
  selector: '[appKeyMap]',
  standalone: true,
})
export class KeyMapDirective {
  private gridFacade = inject(GridFacade)

  private multiFacade = inject(MultiFacade)
  private selectedFacade = inject(SelectedFacade)
  private panelsFacade = inject(PanelsFacade)
  private gridFactory = inject(GridFactory)
  private selectedFactory = inject(SelectedFactory)
  private multiFactory = inject(MultiFactory)
  private multiStore = inject(MultiStoreService)
  private gridStore = inject(GridStoreService)
  private linksStore = inject(LinksStoreService)
  private selectedStore = inject(SelectedStoreService)
  private panelsStore = inject(PanelsStoreService)
  private stringsFacade = inject(StringsFacade)
  private stringFactory = inject(StringsFactory)


  @HostListener('window:keyup', ['$event'])
  async keyEvent(event: KeyboardEvent) {
    console.log(event)
    switch (event.key) {
      case 'Alt': {
        const multiState = await firstValueFrom(this.multiFacade.state$)
        if (multiState.locationStart && event.key === 'Alt') {
          this.multiStore.dispatch.clearMultiState()
        }
      }
        break
      case 's': {
        const selectedId = await this.selectedFacade.selectedId
        if (!selectedId) break

        const panel = await this.panelsFacade.panelById(selectedId)
        if (!panel) break

        await this.gridFactory.select(GridMode.SELECT)
        await this.selectedFactory.selectString(panel.stringId)

        break
      }
      case 'l': {
        const gridMode = await this.gridStore.select.gridMode
        if (gridMode === GridMode.LINK) {
          this.gridStore.dispatch.selectGridMode(GridMode.SELECT)
          this.linksStore.dispatch.clearLinkState()
          break
        }
        const isStringSelected = await this.selectedStore.select.selectedStringId
        if (!isStringSelected) break
        this.gridStore.dispatch.selectGridMode(GridMode.LINK)
        this.selectedStore.dispatch.clearSingleSelected()

        break

      }
      case 'c':
        this.gridStore.dispatch.selectCreateMode()
        break
      case 'x': {
        const multiSelectIds = await this.selectedFacade.multiSelectIds
        if (!multiSelectIds) break
        const amountOfStrings = await this.stringsFacade.totalStrings()
        const newStringName = `S${amountOfStrings + 1}`
        // const newStringName = `STRING_${amountOfStrings + 1}`
        const result = await this.stringFactory.addSelectedToNew(newStringName)
        console.log(result)
        break
      }
      case 'Delete': {
        const singleAndMultiIds = await this.selectedFacade.singleAndMultiIds
        if (singleAndMultiIds.multiIds && singleAndMultiIds.multiIds.length > 0) {
          await this.multiFactory.deleteMany(singleAndMultiIds.multiIds)
          break
        }
        if (singleAndMultiIds.singleId) {
          await this.panelsStore.dispatch.deletePanel(singleAndMultiIds.singleId)
          break
        }
        break
      }
      case 'Escape':
        this.gridStore.dispatch.clearEntireGridState()
        break
    }
  }
}
