import { DragDropModule } from '@angular/cdk/drag-drop'
import { CommonModule } from '@angular/common'
import { Component, inject, Input } from '@angular/core'
import { MatSnackBar } from '@angular/material/snack-bar'
import { ClickService, DropService, MouseService } from '@grid-layout/data-access/services'
import { ControllerEvent, ElementOffsets } from '@grid-layout/shared/models'
import { LetModule } from '@ngrx/component'
import { GridFacade } from '@project-id/data-access/facades'
import { BlockModel } from '@shared/data-access/models'
import { DoubleClickService } from 'libs/grid-layout/data-access/services/src/lib/double-click.service'
import { Observable } from 'rxjs'
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
  public doubleClickService = inject(DoubleClickService)
  private gridFacade = inject(GridFacade)
  private snackBar = inject(MatSnackBar)

  @Input() rows!: number
  @Input() cols!: number
  @Input() blocks$!: Observable<BlockModel[]>

  gridMode$ = this.gridFacade.gridMode$
  clientXY$ = this.gridFacade.clientXY$

  offsets: ElementOffsets = {
    offsetHeight: undefined,
    offsetWidth: undefined,
  }

  numSequence(n: number): Array<number> {
    return Array(n)
  }

  async controller(event: ControllerEvent) {
    switch (event.type) {
      case 'CLICK': {
        const result = await this.clickService.click({
          event: event.event,
          location: event.location,
        })
        if (result.payload.action === 'ERROR') {
          this.snack(result.payload.data.error, 'OK', 5000)
        }
        break
      }
      case 'DROP': {
        const result = await this.dropService.drop(event.event)
        if (result.payload.action === 'ERROR') {
          this.snack(result.payload.data.error, 'OK', 5000)
        }
        break
      }
      case 'MOUSE': {
        const result = await this.mouseService.mouse({
          event: event.event,
          location: event.location,
        })
        if (result.payload.action === 'ERROR') {
          this.snack(result.payload.data.error, 'OK', 5000)
        }
        break
      }
      default:
        break
    }
  }

  private snack(message: string, action: string, duration: number) {
    this.snackBar.open(message, action, {
      duration,
    })
  }
}
