import { ClientXY } from './data-access/models/client-x-y.model';
import { DragDropModule } from '@angular/cdk/drag-drop'
import { CommonModule } from '@angular/common'
import { Component, ElementRef, HostListener, inject, ViewChild } from '@angular/core'
import { LetModule } from '@ngrx/component'
import { BlocksFacade, MultiFacade } from '@project-id/data-access/store'
import { BlockModel } from '@shared/data-access/models'
import { Observable } from 'rxjs'
import { runInThisContext } from 'vm'
import { GridService } from './data-access/services/grid.service'
import { GridStore } from './data-access/store/grid.store'
import { CanvasDirective } from './directives/canvas.directive'
import { DynamicComponentDirective } from './directives/dynamic-component.directive'
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
    CanvasDirective
  ],
  templateUrl: './grid-layout.component.html',
  hostDirectives: [KeyMapDirective],
  styles: [],
})
export class GridLayoutComponent {
  @ViewChild('canvas', { static: true })
  canvas!: ElementRef<HTMLCanvasElement>
  private ctx!: CanvasRenderingContext2D
  public gridStore = inject(GridStore)
  public gridService = inject(GridService)
  private multiFacade = inject(MultiFacade)
  blocks$: Observable<BlockModel[]> = inject(BlocksFacade).blocksFromRoute$
  mouseEvent$?: Observable<unknown>
  rows = 20
  cols = 40
  clientXY$: Observable<ClientXY> = this.gridStore.coords$

  mouseEvent(event: MouseEvent, location: string) {
    event.preventDefault()
    event.stopPropagation()
    this.gridStore.mouseEvent({ location, event })
    /*  this.mouseEvent$ = this.gridService.mouseEvent({ location, event }).pipe(
      take(1),
      distinctUntilChanged(),
      tap((res) => {
        if (res) {
          switch (res[0]) {
            case MultiEventType.SelectStart:
              this.multiFacade.startMultiSelect(res[1].location)
              break
            case MultiEventType.SelectFinish:
              this.multiFacade.finishMultiSelect(res[1].location, res[1].ids)
              break
            case MultiEventType.CreateStartPanel:
              this.multiFacade.startMultiCreate(res[1].location, BlockType.PANEL)
              break
            case MultiEventType.CreateFinishPanel:
              this.multiFacade.finishMultiCreatePanels(
                res[1].location,
                BlockType.PANEL,
                res[1].panels,
              )
              break
          }
        }
      }),
    ) */
  }

  // @HostListener('window:keyup', ['$event'])
  async altKeyup(event: KeyboardEvent) {
    event.preventDefault()
    event.stopPropagation()
    console.log(event)
    /*    if (event.key === 'Alt') {
          this.altKeyUpEvent.emit(event)
          const multiMode = await firstValueFrom(this.store.select(selectMultiMode))
          if (multiMode) {
            this.store.dispatch(MultiActions.clearMultiState())
          }
        }*/
  }

  numSequence(n: number): Array<number> {
    return Array(n)
  }
}
