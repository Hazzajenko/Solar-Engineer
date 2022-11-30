import { PanelsEntityService } from '../../project-id/services/ngrx-data/panels-entity/panels-entity.service'
import { CablesEntityService } from '../../project-id/services/ngrx-data/cables-entity/cables-entity.service'
import { InvertersEntityService } from '../../project-id/services/ngrx-data/inverters-entity/inverters-entity.service'
import { JoinsEntityService } from '../../project-id/services/ngrx-data/joins-entity/joins-entity.service'
import { LinksService } from '../../project-id/services/links.service'
import { LoggerService } from '../../../services/logger.service'

export class GridService {
  constructor(
    protected panelsEntity: PanelsEntityService,
    protected cablesEntity: CablesEntityService,
    protected invertersEntity: InvertersEntityService,
    protected joinsEntity: JoinsEntityService,
    protected joinsService: LinksService,
    protected logger: LoggerService,
  ) {}
}
