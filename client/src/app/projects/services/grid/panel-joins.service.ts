import { GridService } from './grid.service'
import { Injectable } from '@angular/core'
import { PanelsEntityService } from '../../project-id/services/ngrx-data/panels-entity/panels-entity.service'
import { CablesEntityService } from '../../project-id/services/ngrx-data/cables-entity/cables-entity.service'
import { InvertersEntityService } from '../../project-id/services/ngrx-data/inverters-entity/inverters-entity.service'
import { JoinsEntityService } from '../../project-id/services/ngrx-data/joins-entity/joins-entity.service'
import { LinksService } from '../../project-id/services/links.service'
import { HttpClient } from '@angular/common/http'
import { LoggerService } from '../../../services/logger.service'
import { Guid } from 'guid-typescript'
import { LinksEntityService } from '../../project-id/services/ngrx-data/links-entity/links-entity.service'
import { LinkModel } from '../../models/link.model'

@Injectable({
  providedIn: 'root',
})
export class PanelJoinsService extends GridService {
  constructor(
    panelsEntity: PanelsEntityService,
    cablesEntity: CablesEntityService,
    invertersEntity: InvertersEntityService,
    joinsEntity: JoinsEntityService,
    joinsService: LinksService,
    logger: LoggerService,
    private panelJoinsEntity: LinksEntityService,
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
    const panelJoinRequest: LinkModel = {
      id: Guid.create().toString(),
      positive_id: positiveId,
      negative_id: negativeId,
    }

    this.panelJoinsEntity.add(panelJoinRequest)
  }
}
