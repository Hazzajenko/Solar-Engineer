import { CableModel } from '../../models/cable.model'
import { GridService } from './grid.service'
import { Injectable } from '@angular/core'
import { PanelsEntityService } from '../../project-id/services/panels-entity/panels-entity.service'
import { CablesEntityService } from '../../project-id/services/cables-entity/cables-entity.service'
import { InvertersEntityService } from '../../project-id/services/inverters-entity/inverters-entity.service'
import { JoinsEntityService } from '../../project-id/services/joins-entity/joins-entity.service'
import { JoinsService } from '../joins.service'
import { HttpClient } from '@angular/common/http'
import { LoggerService } from '../../../services/logger.service'

export interface SurroundingCablesModel {
  topCable?: CableModel
  bottomCable?: CableModel
  leftCable?: CableModel
  rightCable?: CableModel
}

@Injectable({
  providedIn: 'root',
})
export class GridHelpers extends GridService {
  constructor(
    panelsEntity: PanelsEntityService,
    cablesEntity: CablesEntityService,
    invertersEntity: InvertersEntityService,
    joinsEntity: JoinsEntityService,
    joinsService: JoinsService,
    logger: LoggerService,
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

  getSurroundings(location: string, cables: CableModel[]) {
    if (!location || !cables) return console.log('getSurroundings err')
    let numberRow: number = 0
    let numberCol: number = 0

    const split = location.split('')
    split.forEach((p, index) => {
      if (p === 'c') {
        const row = location.slice(3, index)
        const col = location.slice(index + 3, location.length)
        numberRow = Number(row)
        numberCol = Number(col)
      }
    })
    const topString: string = `row${numberRow - 1}col${numberCol}`
    const bottomString: string = `row${numberRow + 1}col${numberCol}`
    const leftString: string = `row${numberRow}col${numberCol - 1}`
    const rightString: string = `row${numberRow}col${numberCol + 1}`

    const findTop = cables.find((cable) => cable.location === topString)
    const findBottom = cables.find((cable) => cable.location === bottomString)
    const findLeft = cables.find((cable) => cable.location === leftString)
    const findRight = cables.find((cable) => cable.location === rightString)

    const surroundingCables: SurroundingCablesModel = {
      topCable: findTop,
      bottomCable: findBottom,
      leftCable: findLeft,
      rightCable: findRight,
    }

    return surroundingCables
  }
}
