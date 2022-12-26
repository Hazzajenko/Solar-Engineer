import { GridStore } from './data-access/grid.store'
import { BlockSwitchComponent } from '@project-id/ui/block-switch'
import { CdkDragDrop, DragDropModule } from '@angular/cdk/drag-drop'
import { CommonModule } from '@angular/common'
import { Component, HostListener, inject } from '@angular/core'
import { LetModule } from '@ngrx/component'
import { BlocksFacade } from '@project-id/data-access/store'
import { BlockModel } from '@shared/data-access/models'
import { Observable } from 'rxjs'
import { GetBlockAsyncPipe } from './pipes/get-block-async.pipe'
import { GetLocationPipe } from './pipes/get-location.pipe'
import { GridService } from 'libs/project-id/feature/grid-layout/src/lib/data-access/grid.service'

@Component({
  selector: 'app-grid-layout',
  standalone: true,
  imports: [
    CommonModule,
    DragDropModule,
    LetModule,
    GetLocationPipe,
    GetBlockAsyncPipe,
    BlockSwitchComponent,
  ],
  templateUrl: './grid-layout.component.html',
  styles: [],
})
export class GridLayoutComponent {
  private gridService = inject(GridService)
  public gridStore = inject(GridStore)
  blocks$: Observable<BlockModel[]> = inject(BlocksFacade).blocksFromRoute$
  rows = 20
  cols = 40

  async cellAction(location: string, event: MouseEvent) {
    /*    if (event.altKey) {
          return
        }
        this.clickEvent.emit(event)

        const gridMode = await firstValueFrom(this.store.select(selectGridMode))
        switch (gridMode) {
          case GridMode.SELECT:
            const block = await firstValueFrom(this.store.select(selectBlockByLocation({ location })))
            if (!block) {
              console.log('dele')
              this.store.dispatch(SelectedStateActions.clearSelectedState())
            }
            break

          case GridMode.CREATE:
            this.createService.createSwitch(location)
            break

          case GridMode.DELETE:
            this.deleteService.deleteSwitch(location)
            break

          case GridMode.LINK:
            this.joinsService.linkSwitch(location, event.shiftKey)
            break
          default:
            break
        }*/
  }

  async mouseDown(event: MouseEvent, location: string) {
    event.preventDefault()
    event.stopPropagation()
    /*    if (event.altKey) {
          this.mouseDownEvent.emit(event)
          const gridMode = await firstValueFrom(this.store.select(selectGridMode))
          switch (gridMode) {
            case GridMode.CREATE:
              this.multiCreateService.multiCreate(location)
              break
            case GridMode.SELECT:
              this.multiSelectService.multiSelect(location)
              break
            case GridMode.DELETE:
              this.multiDeleteService.multiDelete(location)
              break
          }
        }*/
  }

  async mouseUp(event: MouseEvent, location: string) {
    /*    const multiMode = await firstValueFrom(this.store.select(selectMultiMode))
        if (!multiMode) {
          return
        }*/
    /* this.mouseUpEvent.emit(event)
     const gridMode = await firstValueFrom(this.store.select(selectGridMode))
     switch (gridMode) {
       case GridMode.CREATE:
         this.multiCreateService.multiCreate(location)
         break
       case GridMode.SELECT:
         this.multiSelectService.multiSelect(location)
         break
       case GridMode.DELETE:
         this.multiDeleteService.multiDelete(location)
         break
     }*/
  }

  @HostListener('window:keyup', ['$event'])
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
