import { AppState } from '../../../../../store/app.state'
import { Injectable } from '@angular/core'
import { Store } from '@ngrx/store'
import { LoggerService } from '../../../../../services/logger.service'
import { LinksService } from '../../links.service'
import { DisconnectionPointModel } from '../../../../models/disconnection-point.model'
import { GridMode } from '../../store/grid/grid-mode.model'
import { SelectedStateActions } from '../../store/selected/selected.actions'
import { GridStateActions } from '../../store/grid/grid.actions'
import { DisconnectionPointsEntityService } from './disconnection-points-entity.service'
import { lastValueFrom } from 'rxjs'
import { selectGridMode } from '../../store/grid/grid.selectors'

@Injectable({
  providedIn: 'root',
})
export class DisconnectionPointsActionService {
  constructor(
    private store: Store<AppState>,
    private disconnectionPointsEntity: DisconnectionPointsEntityService,
    private logger: LoggerService,
    private joinsService: LinksService,
  ) {}

  dpAction(disconnectionPoint: DisconnectionPointModel) {
    if (!disconnectionPoint) {
      return this.logger.error('err dpAction !disconnectionPoint')
    }

    lastValueFrom(this.store.select(selectGridMode))
      .then((gridMode) => {
        switch (gridMode) {
          case GridMode.JOIN:
            this.joinsService.addDpToLink(disconnectionPoint)

            break
          case GridMode.DELETE:
            this.disconnectionPointsEntity.delete(disconnectionPoint)
            break
          case GridMode.SELECT:
            this.store.dispatch(
              SelectedStateActions.selectDp({ dpId: disconnectionPoint.id }),
            )
            break
          default:
            this.store.dispatch(
              GridStateActions.changeGridmode({ mode: GridMode.SELECT }),
            )
            this.store.dispatch(
              SelectedStateActions.selectDp({ dpId: disconnectionPoint.id }),
            )
            break
        }
      })
      .catch((err) => {
        return this.logger.error(
          'err dpAction this.store.select(selectGridMode)' + err,
        )
      })
  }
}