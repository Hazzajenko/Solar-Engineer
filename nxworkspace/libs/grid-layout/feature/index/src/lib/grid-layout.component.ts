import { GridClick } from '@grid-layout/data-access/utils'
import { CdkDragDrop, DragDropModule } from '@angular/cdk/drag-drop'
import { CommonModule } from '@angular/common'
import { Component, inject, Input } from '@angular/core'
import { GridRepository } from '@grid-layout/data-access/repositories'
import { ClickService, DropService, MouseService } from '@grid-layout/data-access/services'
import { ClientXY, ElementOffsets, MouseEventRequest } from '@grid-layout/shared/models'
import { LetModule } from '@ngrx/component'
import { MultiFacade } from '@project-id/data-access/facades'
import { BlockModel } from '@shared/data-access/models'
import { firstValueFrom, map, Observable } from 'rxjs'
import { CanvasDirective } from './directives/canvas.directive'
import { DynamicComponentDirective } from './directives/dynamic-component.directive'
import { GridDirective } from './directives/grid.directive'
import { KeyMapDirective } from './directives/key-map.directive'
import { GetBlockPipe } from './pipes/get-block.pipe'
import { GetLocationPipe } from './pipes/get-location.pipe'

@Component({
  selector: 'app-grid-layout',
  standalone: true,
  imports: [
    CommonModule,
    DragDropModule,
    LetModule,
    GetLocationPipe,
    GetBlockPipe,
    CanvasDirective,
    GridDirective,
    DynamicComponentDirective,
  ],
  templateUrl: './grid-layout.component.html',
  hostDirectives: [KeyMapDirective],
  styles: [],
})
export class GridLayoutComponent {
  public clickService = inject(ClickService)
  public dropService = inject(DropService)
  public mouseService = inject(MouseService)
  public multiFacade = inject(MultiFacade)
  public gridRepository = inject(GridRepository)

  @Input() rows!: number
  @Input() cols!: number
  @Input() blocks$!: Observable<BlockModel[]>

  clientXY: ClientXY = {
    clientX: undefined,
    clientY: undefined,
  }
  offsets: ElementOffsets = {
    offsetHeight: undefined,
    offsetWidth: undefined,
  }

  numSequence(n: number): Array<number> {
    return Array(n)
  }

  async click(event: MouseEventRequest) {
    /*     const piped = await firstValueFrom(
      this.blocks$.pipe(map((blocks) => blocks.find((block) => block.location === event.location))),
    ) */

    // const res2 = new GridClick(piped, event.event, event.location)
    const res = await this.clickService.click(event)
    // const res = await this.clickService.click(res2)

    // this.gridRepository.updateState(res)
  }

  async drop(event: CdkDragDrop<BlockModel[]>) {
    this.dropService.drop(event)
  }

  async mouse(event: MouseEventRequest) {
    if (!event.event.altKey) {
      this.clientXY = {
        clientX: undefined,
        clientY: undefined,
      }
      return
    }

    const multiState = await this.multiFacade.state
    if (event.event.type === 'mousedown' && !multiState.locationStart) {
      this.clientXY = {
        clientX: event.event.clientX,
        clientY: event.event.clientY,
      }
      console.log(this.clientXY)
    }

    if (event.event.type === 'mouseup' && multiState.locationStart) {
      this.clientXY = {
        clientX: undefined,
        clientY: undefined,
      }
    }

    this.mouseService.mouse(event, multiState)
  }
}
