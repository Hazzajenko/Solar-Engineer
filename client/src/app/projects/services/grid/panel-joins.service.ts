import { GridService } from './grid.service'
import { Injectable } from '@angular/core'
import { PanelsEntityService } from '../../project-id/services/panels-entity/panels-entity.service'
import { CablesEntityService } from '../../project-id/services/cables-entity/cables-entity.service'
import { InvertersEntityService } from '../../project-id/services/inverters-entity/inverters-entity.service'
import { JoinsEntityService } from '../../project-id/services/joins-entity/joins-entity.service'
import { JoinsService } from '../joins.service'
import { HttpClient } from '@angular/common/http'
import { LoggerService } from '../../../services/logger.service'
import { Guid } from 'guid-typescript'
import { PanelJoinsEntityService } from '../../project-id/services/panel-joins-entity/panel-joins-entity.service'
import { PanelJoinModel } from '../../models/panel-join.model'

@Injectable({
  providedIn: 'root',
})
export class PanelJoinsService extends GridService {
  constructor(
    panelsEntity: PanelsEntityService,
    cablesEntity: CablesEntityService,
    invertersEntity: InvertersEntityService,
    joinsEntity: JoinsEntityService,
    joinsService: JoinsService,
    logger: LoggerService,
    private panelJoinsEntity: PanelJoinsEntityService,
    private http: HttpClient,
  ) {
    super(
      panelsEntity,
      cablesEntity,
      invertersEntity,
      joinsEntity,
      joinsService,
      logger,
    )
  }

  createPanelJoin(projectId: number, positiveId: string, negativeId: string) {
    const panelJoinRequest: PanelJoinModel = {
      id: Guid.create().toString(),
      positive_id: positiveId,
      negative_id: negativeId,
    }

    this.panelJoinsEntity.add(panelJoinRequest)
  }
}
