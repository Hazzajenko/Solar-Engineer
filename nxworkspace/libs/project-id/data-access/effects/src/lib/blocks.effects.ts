import { inject, Injectable } from '@angular/core';
import { Actions } from '@ngrx/effects';
import { PanelsFacade } from '@project-id/data-access/facades';

@Injectable()
export class BlocksEffects {
  private actions$ = inject(Actions)
  private panelsFacade = inject(PanelsFacade)

/*   addBlock$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(BlocksActions.addBlockForGrid),
        switchMap(({ block }) => {
          switch (block.type) {
            case BlockType.PANEL:
              return this.panelsFacade.panelById(block.id)
            default:
              return of(undefined)
          }
        }),
        switchMap(item => {
          switch (item?.type) {
            case BlockType.PANEL:
              return of(PanelsActions.addPanel({panel: item}))
             default:
              return of(BlocksActions.noop)
          }
        })
      ),
  ) */
/*
  updateBlock$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(BlocksActions.updateBlockForGrid),
        switchMap(({ update }) => this.blocksFacade.blockById(update.id.toString()).pipe(combineLatestWith(of(update)))

        ),
        switchMap(([block, update]) => {
          switch (block?.type) {
            case BlockType.PANEL:
              return this.panelsFacade.panelById(block.id)
            default:
              return of(undefined)
          }
        }),
        switchMap(item => {
          switch (item?.type) {
            case BlockType.PANEL:
              return of(PanelsActions.updatePanel({update: item}))
             default:
              return of(BlocksActions.noop)
          }
        })
      ),
  ) */
}
