import { ClientXY } from './../models/client-x-y.model'

import { MultiFacade, SelectedFacade } from '@project-id/data-access/store'

import { inject, Injectable } from '@angular/core'
import { ComponentStore } from '@ngrx/component-store'
import { BlocksFacade, PanelsFacade } from '@project-id/data-access/store'
import { Observable } from 'rxjs'

import { ClickService } from '../services/click/click.service'
import { DropService } from '../services/drop/drop.service'

import { MouseService } from '../services/mouse/mouse.service'

interface GridState {
  clientXY: ClientXY
}

const initialGridState = {
  clientXY: {
    clientX: undefined,
    clientY: undefined,
  },
}

@Injectable({
  providedIn: 'root',
})
export class GridStore extends ComponentStore<GridState> {
  clientXY$: Observable<ClientXY> = this.select((state) => state.clientXY)

  private blocksFacade = inject(BlocksFacade)
  private panelsFacade = inject(PanelsFacade)

  private selectedFacade = inject(SelectedFacade)
  private mouseService = inject(MouseService)
  private clickService = inject(ClickService)
  private dropService = inject(DropService)
  private multiFacade = inject(MultiFacade)
  /*
  readonly click = this.effect((click$: Observable<GridMouseEvent>) =>
    click$.pipe(
      tap((click) => {
        click.event.preventDefault()
        click.event.stopPropagation()
      }),
      switchMap((click) =>
        this.clickService.click(click).pipe(
          tap((res) => {
            if (!res) return
            const ans = isEVVType(res)
            if (ans === 'other') return
            switch (res[0]) {
              case 'CREATE_PANEL':

                // res[1]
            }
            if (res) {
              console.log(res)
              this.panelsFacade.createPanel(res)
            }
          }),
        ),
      ),
    ),
  )

  readonly click2 = this.effect((click$: Observable<GridMouseEvent>) =>
  click$.pipe(
    tap((click) => {
      click.event.preventDefault()
      click.event.stopPropagation()
    }),
    map((click) =>
      this.clickService.click2(click)),
        tap((res) => {
          if (!res) return
          res.then(hi => {
            switch (hi.type) {
              case 'CREATE_PANEL': {
                hi.payload

              }
            }
          })
          const ans = isEVVType(res)
          if (ans === 'other') return
          switch (res[0]) {
            case 'CREATE_PANEL':

              // res[1]
          }
          if (res) {
            console.log(res)
            this.panelsFacade.createPanel(res)
          }
        }),

    ),

) */

  /*  readonly drop = this.effect((drop$: Observable<CdkDragDrop<BlockModel[]>>) =>
    drop$.pipe(
      tap((drop) => {
        drop.event.preventDefault()
        drop.event.stopPropagation()
      }),
      switchMap((drop) =>
        combineLatest([of(drop), this.blocksFacade.blockByLocation(drop.container.id)]),
      ),
      map(([drop, existingBlock]) => this.dropService.drop(drop, existingBlock)),
      tap((res) => {
        switch (res[0]) {
          case DropEventAction.UpdatePanel:
            this.panelsFacade.updatePanel(res[1].update)
            break
          case DropEventAction.BlockTaken:
            this.selectedFacade.selectPanel(res[1].id)
            break
          case DropEventAction.Error:
            break
        }
      }),
    ),
  )

  readonly mouse = this.effect((mouse$: Observable<MouseEventModel>) =>
    mouse$.pipe(
      distinctUntilChanged(),
      combineLatestWith(this.multiFacade.state$),
      tap(([mouse, multiState]) => {
        if (mouse) {
          if (mouse.event.type === 'mousedown' && !multiState.locationStart) {
            this.patchState({
              clientXY: {
                clientX: mouse.event.clientX,
                clientY: mouse.event.clientY,
              },
            })
          }
          if (mouse.event.type === 'mouseup' && multiState.locationStart) {
            this.patchState({
              clientXY: {
                clientX: undefined,
                clientY: undefined,
              },
            })
          }
        }
      }),
      switchMap(([mouse, multiState]) => {
        if (!mouse) return of(undefined)
        return this.mouseService.mouse(mouse, multiState).pipe(
          tap((res) => {
            if (res) {
              switch (res[0]) {
                case MouseEventAction.SelectStart:
                  this.multiFacade.startMultiSelect(res[1].location)
                  break
                case MouseEventAction.SelectFinish:
                  this.multiFacade.finishMultiSelect(res[1].location, res[1].ids)
                  break
                case MouseEventAction.CreateStartPanel:
                  this.multiFacade.startMultiCreate(res[1].location, BlockType.PANEL)
                  break
                case MouseEventAction.CreateFinishPanel:
                  this.multiFacade.finishMultiCreatePanels(
                    res[1].location,
                    BlockType.PANEL,
                    res[1].panels,
                  )
                  break
              }
            }
          }),
        )
      }),
      catchError((err) => {
        console.error(err)
        return of(undefined)
      }),
    ),
  ) */
  constructor() {
    super(initialGridState)
  }
}
