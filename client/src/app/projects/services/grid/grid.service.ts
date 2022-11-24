import { PanelsEntityService } from '../../project-id/services/panels-entity/panels-entity.service'
import { CablesEntityService } from '../../project-id/services/cables-entity/cables-entity.service'
import { InvertersEntityService } from '../../project-id/services/inverters-entity/inverters-entity.service'
import { JoinsEntityService } from '../../project-id/services/joins-entity/joins-entity.service'
import { JoinsService } from '../joins.service'
import { LoggerService } from '../../../services/logger.service'

export class GridService {
  constructor(
    protected panelsEntity: PanelsEntityService,
    protected cablesEntity: CablesEntityService,
    protected invertersEntity: InvertersEntityService,
    protected joinsEntity: JoinsEntityService,
    protected joinsService: JoinsService,
    protected logger: LoggerService,
  ) {}
}
