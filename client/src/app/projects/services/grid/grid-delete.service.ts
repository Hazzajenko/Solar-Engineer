import { Injectable } from '@angular/core'
import { StringModel } from '../../models/string.model'
import { GridMode } from '../../store/grid/grid-mode.model'
import { ProjectModel } from '../../models/project.model'
import { BlockModel } from '../../models/block.model'
import { UnitModel } from '../../models/unit.model'
import { GridService } from './grid.service'
import { PanelsEntityService } from '../../project-id/services/panels-entity/panels-entity.service'
import { CablesEntityService } from '../../project-id/services/cables-entity/cables-entity.service'
import { InvertersEntityService } from '../../project-id/services/inverters-entity/inverters-entity.service'
import { JoinsEntityService } from '../../project-id/services/joins-entity/joins-entity.service'
import { JoinsService } from '../joins.service'
import { LoggerService } from '../../../services/logger.service'
import { PanelJoinsEntityService } from '../../project-id/services/panel-joins-entity/panel-joins-entity.service'

@Injectable({
  providedIn: 'root',
})
export class GridDeleteService extends GridService {
  constructor(
    panelsEntity: PanelsEntityService,
    cablesEntity: CablesEntityService,
    invertersEntity: InvertersEntityService,
    joinsEntity: JoinsEntityService,
    joinsService: JoinsService,
    logger: LoggerService,
    private panelJoinsEntity: PanelJoinsEntityService,
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

  deleteSwitch(
    location: string,
    gridState: {
      createMode?: UnitModel
      selectedStrings?: StringModel[]
      selectedString?: StringModel
      gridMode?: GridMode
    },
    project: ProjectModel,
    blocks: BlockModel[],
  ) {
    const toDelete = blocks.find((block) => block.location === location)
    if (!toDelete) return console.log('nothing to delete')

    switch (toDelete.model) {
      case UnitModel.PANEL:
        /*        const poo = this.panelJoinsEntity.entities$.subscribe(panelJoins => {
                  const positiveLink = panelJoins.find(panelJoin => panelJoin.positive_id === toDelete.id)
                  const negativeLink = panelJoins.find(panelJoin => panelJoin.negative_id === toDelete.id)
                })*/
        this.panelJoinsEntity.entities$.subscribe((panelJoins) => {
          const positiveLink = panelJoins.find(
            (panelJoin) => panelJoin.positive_id === toDelete.id,
          )
          const negativeLink = panelJoins.find(
            (panelJoin) => panelJoin.negative_id === toDelete.id,
          )
          console.log('positiveLink', positiveLink)
          console.log('negativeLink', negativeLink)
          if (positiveLink) this.panelJoinsEntity.delete(positiveLink.id)
          if (negativeLink) this.panelJoinsEntity.delete(negativeLink.id)
          return
        })

        this.panelsEntity.delete(toDelete.id!)

        break
      case UnitModel.CABLE:
        return this.cablesEntity.delete(toDelete.id!)
      case UnitModel.INVERTER:
        return this.invertersEntity.delete(toDelete.id!)
      default:
        break
    }
  }

  deletePanel(panelId: string) {
    /*    this.panelJoinsEntity.entities$.subscribe((panelJoins) => {
          const positiveLink = panelJoins.find(
            (panelJoin) => panelJoin.positive_id === panelId,
          )
          const negativeLink = panelJoins.find(
            (panelJoin) => panelJoin.negative_id === panelId,
          )

          if (positiveLink) {
            console.log('deleted positive link', positiveLink)
            this.panelJoinsEntity.delete(positiveLink.id)
          } else {
            console.log('no positive')
          }

          if (negativeLink) {
            console.log('deleted negative link', negativeLink)
            this.panelJoinsEntity.delete(negativeLink.id)
            this.panelJoinsEntity.updateOneInCache()
          } else {
            console.log('no negative')
          }


        })*/
    return this.panelsEntity.delete(panelId)
  }
}
