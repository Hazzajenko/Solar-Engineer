import { DragDropModule } from '@angular/cdk/drag-drop'
import { CommonModule } from '@angular/common'
import { Component, inject, Input } from '@angular/core'
import { MatSnackBar } from '@angular/material/snack-bar'
import { ClickService, DropService, MouseService } from '@grid-layout/data-access/services'
import { KeymapOverlayComponent } from '@grid-layout/feature/keymap'
import { StringTotalsOverlayComponent } from '@grid-layout/feature/string-stats'
import { ControllerEvent, ElementOffsets } from '@grid-layout/shared/models'
import { LetModule } from '@ngrx/component'
import { GridFacade, SelectedFacade, StringsFacade } from '@project-id/data-access/facades'
import { BlockModel, StringModel } from '@shared/data-access/models'
import { DoubleClickService } from 'libs/grid-layout/data-access/services/src/lib/double-click.service'
import { UiFacade } from 'libs/project-id/data-access/facades/src/lib/ui.facade'
import { Observable, switchMap } from 'rxjs'
import { map } from 'rxjs/operators'
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
    KeymapOverlayComponent,
    StringTotalsOverlayComponent,
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
  private uiFacade = inject(UiFacade)
  private snackBar = inject(MatSnackBar)
  private selectedFacade = inject(SelectedFacade)
  private stringsFacade = inject(StringsFacade)
  showKeymap$ = this.uiFacade.keymap$

  selectedString$: Observable<StringModel | undefined> = this.selectedFacade.selectedStringId$.pipe(
    switchMap(stringId => this.stringsFacade.stringById$(stringId).pipe(
      map(string => {
        if (!string) return undefined
        return string
      }),
    )),
  )

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

  private snack(message: string, action: string, duration: number) {
    this.snackBar.open(message, action, {
      duration,
    })
  }
}
