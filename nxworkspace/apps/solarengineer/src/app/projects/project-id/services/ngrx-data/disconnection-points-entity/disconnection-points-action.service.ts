import { AppState } from '../../../../../store/app.state'
import { Injectable } from '@angular/core'
import { Store } from '@ngrx/store'
import { LoggerService } from '../../../../../services/logger.service'
import { LinksService } from '../../links/links.service'
import { DisconnectionPointsEntityService } from './disconnection-points-entity.service'

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

  /*dpAction(disconnectionPoint: DisconnectionPointModel) {
    if (!disconnectionPoint) {
      return this.logger.error('err dpAction !disconnectionPoint')
    }

    lastValueFrom(this.store.select(selectGridMode))
      .then((gridMode) => {
        switch (gridMode) {
          case GridMode.LINK:
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
  }*/
}
