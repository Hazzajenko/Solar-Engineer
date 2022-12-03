import { Injectable } from '@angular/core'
import { Actions } from '@ngrx/effects'
import { Store } from '@ngrx/store'
import { AppState } from '../../../../../store/app.state'
import { PanelsService } from '../../../../services/panels.service'
import { JoinsEntityService } from './joins-entity.service'

@Injectable()
export class JoinsEntityEffects {
  constructor(
    private actions$: Actions,
    private panelsService: PanelsService,
    private panelsEntity: JoinsEntityService,
    private store: Store<AppState>,
  ) {}
}
