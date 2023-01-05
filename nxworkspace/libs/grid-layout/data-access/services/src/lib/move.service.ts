import { GridFactory, MouseEventRequest } from '@grid-layout/data-access/utils'
import { inject, Injectable } from '@angular/core'
import { GridEventResult } from '@grid-layout/data-access/actions'
import { GridEventFactory, MultiFactory } from '@grid-layout/data-access/utils'

import { BlocksFacade, GridFacade, MultiFacade, PanelsFacade } from '@project-id/data-access/facades'
import { UiRepository } from '@project-id/data-access/repositories'
import { MultiStateModel } from '@project-id/shared/models'
import { ProjectsFacade } from '@projects/data-access/facades'
import { BlockType, GridMode } from '@shared/data-access/models'
import { UiFacade } from 'libs/project-id/data-access/facades/src/lib/ui.facade'
import { getLocationsInBox } from './utils/get-locations-in-box'

@Injectable({
  providedIn: 'root',
})
export class MoveService {
  private projectsFacade = inject(ProjectsFacade)
  private eventFactory = inject(GridEventFactory)
  // private eventFactory = new GridEventFactory()
  private blocksFacade = inject(BlocksFacade)
  private multiFacade = inject(MultiFacade)
  private gridFactory = inject(GridFactory)
  private multiFactory = inject(MultiFactory)
  private gridFacade = inject(GridFacade)
  private uiRepository = inject(UiRepository)
  private uiFacade = inject(UiFacade)

  private speed = 0.1

  async move(move: MouseEventRequest) {
    move.event.preventDefault()
    move.event.stopPropagation()

    /*    const isGridLayoutMoving = await this.uiFacade.gridLayoutMoving
        if (isGridLayoutMoving && move.event.ctrlKey) {
          console.log(move.event)
          const mouseXY = await this.uiFacade.mouseXY
          if (!mouseXY || !mouseXY.mouseX || !mouseXY.mouseY) return undefined
          /!*      const gridLayoutXY = await this.uiFacade.gridLayoutXY
                if (!gridLayoutXY || !gridLayoutXY.componentX || !gridLayoutXY.componentY) return undefined
                const dx = move.event.clientX - mouseXY.mouseX
                const dy = move.event.clientY - mouseXY.mouseY
                const scaledDx = dx * this.speed
                const scaledDy = dy * this.speed
                /!*      let componentX = [...gridLayoutXY.componentX];
                      let componentY = [...y];*!/
                const updatedComponentX = gridLayoutXY.componentX + scaledDx
                const updatedComponentY = gridLayoutXY.componentY + scaledDy*!/
          const componentX = move.event.clientX - mouseXY.mouseX
          const componentY = move.event.clientY - mouseXY.mouseY
          this.uiRepository.setGridlayoutComponentXy({
            componentX,
            componentY,
          })
          return
        }
        if (isGridLayoutMoving && !move.event.ctrlKey) {
          // this.uiRepository.resetGridlayoutComponentXy()
          this.uiRepository.stopGridlayoutMoving()
        }*/
    return
  }

}
