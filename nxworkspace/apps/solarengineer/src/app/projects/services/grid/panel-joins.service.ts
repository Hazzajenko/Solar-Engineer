import { GridService } from './grid.service'
import { Injectable } from '@angular/core'
import { PanelsEntityService } from '../../project-id/services/ngrx-data/panels-entity/panels-entity.service'
import { CablesEntityService } from '../../project-id/services/ngrx-data/cables-entity/cables-entity.service'
import { InvertersEntityService } from '../../project-id/services/ngrx-data/inverters-entity/inverters-entity.service'
import { JoinsEntityService } from '../../project-id/services/ngrx-data/joins-entity/joins-entity.service'
import { LinksService } from '../../project-id/services/links/links.service'
import { HttpClient } from '@angular/common/http'
import { LoggerService } from '../../../services/logger.service'
import { Guid } from 'guid-typescript'
import { PanelLinksEntityService } from '../../project-id/services/ngrx-data/panel-links-entity/panel-links-entity.service'
import { PanelLinkModel } from '../../../../../../../libs/shared/data-access/models/src/lib/panel-link.model'

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
    private panelJoinsEntity: PanelLinksEntityService,
    private http: HttpClient,
  ) {
    super(panelsEntity, cablesEntity, invertersEntity, joinsEntity, joinsService, logger)
  }

  createPanelJoin(projectId: number, positiveId: string, negativeId: string) {
    const panelJoinRequest: PanelLinkModel = {
      id: Guid.create().toString(),
      positiveToId: positiveId,
      negativeToId: negativeId,
    }

    this.panelJoinsEntity.add(panelJoinRequest)
  }
}
