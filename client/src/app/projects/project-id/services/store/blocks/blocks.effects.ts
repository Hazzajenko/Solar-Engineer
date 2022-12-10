import { PanelLinksEntityService } from '../../ngrx-data/panel-links-entity/panel-links-entity.service'
import { Injectable } from '@angular/core'
import { Actions, createEffect, ofType } from '@ngrx/effects'
import { Store } from '@ngrx/store'
import { AppState } from '../../../../../store/app.state'
import { PanelsEntityService } from '../../ngrx-data/panels-entity/panels-entity.service'
import { StringsEntityService } from '../../ngrx-data/strings-entity/strings-entity.service'
import { StatsService } from '../../stats.service'
import { firstValueFrom, lastValueFrom, switchMap } from 'rxjs'
import { BlocksStateActions } from './blocks.actions'
import { UnitModel } from '../../../../models/unit.model'
import { BlockModel } from '../../../../models/block.model'
import { HttpClient } from '@angular/common/http'
import { selectCurrentProjectId } from '../projects/projects.selectors'
import { map } from 'rxjs/operators'
import { ObservableService } from '../../observable.service'
import { RailsEntityService } from '../../ngrx-data/rails-entity/rails-entity.service'
import { RailModel } from '../../../../models/rail.model'
import { PanelsHelperService } from '../../ngrx-data/panels-entity/panels.service'

@Injectable()
export class BlocksEffects {
  deleteManyBlocks = createEffect(
    () =>
      this.actions$.pipe(
        ofType(BlocksStateActions.deleteManyBlocksForGrid),
        switchMap((action) =>
          this.store.select(selectCurrentProjectId).pipe(
            map((projectId) => {
              let blocks: BlockModel[] = action.blocks

              const panelBlocks = blocks
                .filter((b) => b.model === UnitModel.PANEL)
                .map((block) => block.id)

              if (panelBlocks) {
                lastValueFrom(
                  this.http.delete(`/api/projects/${projectId}/panels`, {
                    body: {
                      panelIds: panelBlocks,
                    },
                  }),
                ).then((res) => {
                  console.log(res)
                })
              }

              const panelRails = blocks
                .filter((b) => b.model === UnitModel.RAIL)
                .map((block) => block.id)

              if (panelRails.length > 0) {
                firstValueFrom(
                  this.observablesService
                    .getItemFromIncludedIdArray(UnitModel.RAIL, panelRails)
                    .pipe(
                      switchMap((rails: RailModel[]) =>
                        this.http.delete(`/api/projects/${projectId}/rails`, {
                          body: {
                            rails,
                          },
                        }),
                      ),
                    ),
                ).then((res) => {
                  console.log(res)
                })
              }
            }),
          ),
        ),
      ),
    { dispatch: false },
  )

  /*  let blocks: BlockModel[] = action.blocks
    const panels = blocks.filter((b) => b.model === UnitModel.PANEL)
    if (panels.length > 0) {
    lastValueFrom(
      this.http.delete()
  )
  }*/

  /*  finishMultiCreatePanel$ = createEffect(
      () =>
        this.actions$.pipe(
          ofType(MultiActions.finishMultiCreatePanel),
          switchMap((action) =>
            this.panelJoinsEntity.entities$.pipe(
              map((res) => {
                const panelLink: PanelLinksToModel = getSelectedLinks(
                  res,
                  action.panelId,
                )
                this.store.dispatch(
                  SelectedStateActions.setSelectedPanelLinks({ panelLink }),
                )
              }),
            ),
          ),
        ),
      { dispatch: false },
    )*/

  constructor(
    private actions$: Actions,
    private panelJoinsEntity: PanelLinksEntityService,
    private panelsEntity: PanelsEntityService,
    private panelsService: PanelsHelperService,
    private stringsEntity: StringsEntityService,
    private railsEntity: RailsEntityService,
    private statsService: StatsService,
    private observablesService: ObservableService,
    private store: Store<AppState>,
    private http: HttpClient,
  ) {}
}
