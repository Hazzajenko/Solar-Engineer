import { inject, Injectable } from '@angular/core'
import { BlocksFacade, GridFacade, GridState, MultiFacade } from '@project-id/data-access/store'
import { ProjectsFacade } from '@projects/data-access/store'
import { GridMode } from '@shared/data-access/models'
import { combineLatest, firstValueFrom } from 'rxjs'

import { ClickRepository } from './click.repository'
import { ClickEventModel, ClickEventReturn } from './utils/click.event'

@Injectable({
  providedIn: 'root',
})
export class ClickService {
  private multiFacade = inject(MultiFacade)
  private gridFacade = inject(GridFacade)
  private blocksFacade = inject(BlocksFacade)
  private clickRepository = inject(ClickRepository)
  private projectsFacade = inject(ProjectsFacade)

  /**
 *
 * @param click - ClickEvent

 */
  async click(click: ClickEventModel): Promise<ClickEventReturn> {
    if (click.event.altKey) {
      return new ClickEventReturn({
        action: 'UNDEFINED',
        result: false,
        error: 'click, click.event.altKey',
      })
    }
    const [gridState, existingBlock] = await firstValueFrom(
      combineLatest([
        this.gridFacade.gridState$,
        this.blocksFacade.blockByLocation(click.location),
      ]),
    )

    if (existingBlock) {
      return this.clickRepository.selectBlock(existingBlock)
    }
    return this.gridModeSwitch(gridState, click.location)
  }

  private async gridModeSwitch(gridState: GridState, location: string): Promise<ClickEventReturn> {
    switch (gridState.gridMode) {
      case GridMode.SELECT:
        return this.clickRepository.clearSelected()
      case GridMode.CREATE:
        return this.clickRepository.createSwitch(location, gridState)
      default:
        return new ClickEventReturn({ action: 'UNDEFINED', result: false, error: 'click, default' })
    }
  }
}
