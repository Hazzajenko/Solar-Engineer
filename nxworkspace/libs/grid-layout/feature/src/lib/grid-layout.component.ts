import { GridRepository } from '@grid-layout/data-access/repositories'
import { CdkDragDrop, DragDropModule } from '@angular/cdk/drag-drop'
import { CommonModule } from '@angular/common'
import { Component, inject, Input } from '@angular/core'
import { LetModule } from '@ngrx/component'
import { MultiFacade } from '@project-id/data-access/store'
import { BlockModel } from '@shared/data-access/models'
import { firstValueFrom, Observable } from 'rxjs'
import { ElementOffsets, ClientXY } from '@grid-layout/shared/models'
import { MouseService, DropService, ClickService } from '@grid-layout/data-access/services'
import { MouseEventRequest } from '@grid-layout/shared/models'
import { CanvasDirective } from './directives/canvas.directive'
import { GridDirective } from './directives/grid.directive'
import { KeyMapDirective } from './directives/key-map.directive'
import { GetBlockPipe } from './pipes/get-block.pipe'
import { GetLocationPipe } from './pipes/get-location.pipe'
import { DynamicComponentDirective } from './directives/dynamic-component.directive'

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
    const res = await this.clickService.click(event)
    this.gridRepository.updateState(res)
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
