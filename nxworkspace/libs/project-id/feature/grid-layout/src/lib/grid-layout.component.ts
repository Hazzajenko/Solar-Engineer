import { CdkDragDrop, DragDropModule } from '@angular/cdk/drag-drop'
import { CommonModule } from '@angular/common'
import { Component, inject, Input } from '@angular/core'
import { LetModule } from '@ngrx/component'
import { MultiFacade } from '@project-id/data-access/store'
import { BlockModel } from '@shared/data-access/models'
import { firstValueFrom, Observable } from 'rxjs'
import { ClientXY } from './data-access/models/client-x-y.model'
import { ElementOffsets } from './data-access/models/element-offsets.model'
import { ClickService } from './data-access/services/click/click.service'
import { DropService } from './data-access/services/drop/drop.service'
import { MouseService } from './data-access/services/mouse/mouse.service'
import { MouseEventRequest } from './data-access/services/utils/events/mouse.event'
import { GridStore } from './data-access/store/grid.store'
import { CanvasDirective } from './directives/canvas.directive'
import { DynamicComponentDirective } from './directives/dynamic-component.directive'
import { GridDirective } from './directives/grid.directive'
import { KeyMapDirective } from './directives/key-map.directive'
import { GetBlockAsyncPipe } from './pipes/get-block-async.pipe'
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
    GetBlockAsyncPipe,
    GetBlockPipe,
    DynamicComponentDirective,
    CanvasDirective,
    GridDirective,
  ],
  templateUrl: './grid-layout.component.html',
  hostDirectives: [KeyMapDirective],
  styles: [],
})
export class GridLayoutComponent {
  public gridStore = inject(GridStore)
  public clickService = inject(ClickService)
  public dropService = inject(DropService)
  public mouseService = inject(MouseService)
  public multiFacade = inject(MultiFacade)

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
    this.clickService.click(event)
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

    const multiState = await firstValueFrom(this.multiFacade.state$)
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
