import { inject, Injectable } from '@angular/core'
import {
  BlocksFacade,
  GridFacade,
  MultiFacade,
  MultiState,
  SelectedFacade,
} from '@project-id/data-access/store'
import { ProjectsFacade } from '@projects/data-access/store'
import { GridMode } from '@shared/data-access/models'
import { firstValueFrom } from 'rxjs'

import { MouseRepository } from './mouse.repository'
import { MouseEventModel, MouseEventReturn } from './utils/mouse.event'

@Injectable({
  providedIn: 'root',
})
export class MouseService {
  private projectsFacade = inject(ProjectsFacade)

  private blocksFacade = inject(BlocksFacade)
  private selectedFacade = inject(SelectedFacade)
  private gridFacade = inject(GridFacade)
  private multiFacade = inject(MultiFacade)
  private mouseRepository = inject(MouseRepository)

  async mouse(mouse: MouseEventModel): Promise<MouseEventReturn> {
    mouse.event.preventDefault()
    mouse.event.stopPropagation()
    const multiState = await firstValueFrom(this.multiFacade.state$)
    if (!mouse.event.altKey) {
      return new MouseEventReturn({
        action: 'UNDEFINED',
        result: false,
      })
    }
    if (mouse.event.type === 'mousedown' && multiState.locationStart) {
      return new MouseEventReturn({
        action: 'UNDEFINED',
        result: false,
        error: 'mouse, mouse.event.type === mousedown && multiState.locationStart',
      })
    }
    if (mouse.event.type === 'mouseup' && !multiState.locationStart) {
      return new MouseEventReturn({
        action: 'UNDEFINED',
        result: false,
        error: 'mouse, mouse.event.type === mouseup && !multiState.locationStart',
      })
    }
    const gridState = await firstValueFrom(this.gridFacade.gridState$)
    switch (gridState.gridMode) {
      case GridMode.SELECT:
        return this.mouseRepository.multiSelect(mouse.location, multiState)
      case GridMode.CREATE:
        return this.mouseRepository.multiCreate(mouse.location, multiState)
      default:
        return new MouseEventReturn({
          action: 'UNDEFINED',
          result: false,
          error: 'mouse, default',
        })
    }
  }
}
