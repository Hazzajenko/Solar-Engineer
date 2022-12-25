import { GridService } from './../../../../../data-access/services/src/lib/grid.service';
import { BlocksFacade } from '@project-id/data-access/store';
import { ComponentStore } from '@ngrx/component-store'
import { inject, Injectable } from '@angular/core'
import { Observable, switchMap, tap } from 'rxjs'
import { CdkDragDrop } from '@angular/cdk/drag-drop'


interface GridState {
  isDragging: boolean

}

@Injectable({
  providedIn: 'root'
})
export class GridStore extends ComponentStore<GridState> {
  isDragging$ = this.select((state) => state.isDragging)


  mouseDown = this.updater((state) =>
  ({
    ...state,
    isDragging: true
    })
  )

  mouseUp = this.updater((state) =>
  ({
    ...state,
    isDragging: false
    })
  )

  private blocksFacade = inject(BlocksFacade)
  private gridService = inject(GridService)

  readonly gridDrop = this.effect((drop$: Observable<CdkDragDrop<any, any>>) =>
  drop$.pipe(
    switchMap(
      (drop) => this.blocksFacade.blockByLocation(drop.container.id).pipe(
        tap(existingBlock => this.gridService.gridDrop(drop, existingBlock))
      ),
    ),
  ),
)

  constructor() {
    super({
      isDragging: false,
    })
  }
}
