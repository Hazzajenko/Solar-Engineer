import { AppState } from '../../../../store/app.state'
import { Injectable } from '@angular/core'
import { PanelsEntityService } from './panels-entity.service'
import { Store } from '@ngrx/store'
import { LoggerService } from '../../../../services/logger.service'
import { JoinsService } from '../../../services/joins.service'

@Injectable({
  providedIn: 'root',
})
export class PanelsActionService {
  constructor(
    private store: Store<AppState>,
    private panelsEntity: PanelsEntityService,
    private logger: LoggerService,
    private joinsService: JoinsService,
  ) {}

  /*  panelAction(panel: PanelModel) {
      if (!panel) {
        this.logger.error('!panel panelAction')
        return
      }

      this.store.select(selectGridMode).pipe(
        tap((gridMode) => {
          switch (gridMode) {
            case GridMode.JOIN:
              this.joinsService.addPanelToJoin(panel, gridMode, joinsState)

              break
            case GridMode.DELETE:
              break
            case GridMode.SELECT:
              this.store.dispatch(
                SelectedStateActions.selectPanel({ panelId: panel.id }),
              )
              break
            default:
              this.store.dispatch(
                GridStateActions.changeGridmode({ mode: GridMode.SELECT }),
              )
              this.store.dispatch(
                SelectedStateActions.selectPanel({ panelId: panel.id }),
              )
          }
        }),
      )
    }*/
}
