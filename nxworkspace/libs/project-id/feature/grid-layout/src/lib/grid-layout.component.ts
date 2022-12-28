import { ClientXY } from './data-access/models/client-x-y.model'
import { DragDropModule } from '@angular/cdk/drag-drop'
import { CommonModule } from '@angular/common'
import {
  AfterViewInit,
  Component,
  ElementRef,
  HostListener,
  inject,
  Input,
  ViewChild,
} from '@angular/core'
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
import { GridDirective } from './directives/grid.directive'
import { ElementOffsets } from './data-access/models/element-offsets.model'

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
  public gridService = inject(GridService)
  @Input() rows!: number
  @Input() cols!: number
  @Input() blocks$!: Observable<BlockModel[]>
  // blocks$: Observable<BlockModel[]> = inject(BlocksFacade).blocksFromRoute$
  mouseEvent$?: Observable<unknown>

  clientXY$: Observable<ClientXY> = this.gridStore.clientXY$
  offsets: ElementOffsets = {
    offsetHeight: undefined,
    offsetWidth: undefined,
  }


  numSequence(n: number): Array<number> {
    return Array(n)
  }
}
