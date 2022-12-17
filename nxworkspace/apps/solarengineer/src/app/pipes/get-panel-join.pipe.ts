import { Pipe, PipeTransform } from '@angular/core'
import { PanelModel } from '../../../../../libs/shared/data-access/models/src/lib/panel.model'
import { PanelLinkModel } from '../../../../../libs/shared/data-access/models/src/lib/panel-link.model'
import { PanelLinksEntityService } from '../projects/project-id/services/ngrx-data/panel-links-entity/panel-links-entity.service'

export interface PanelLinks {
  positive?: string
  negative?: string
}

@Pipe({
  name: 'getPanelJoin',
  standalone: true,
})
export class GetPanelJoinPipe implements PipeTransform {
  constructor(private panelJoinsEntity: PanelLinksEntityService) {}

  transform(panel: PanelModel) {
    let positiveJoin: PanelLinkModel | undefined
    let negativeJoin: PanelLinkModel | undefined

    this.panelJoinsEntity.entities$.subscribe((pJoins) => {
      positiveJoin = pJoins.find((panelJoin) => panelJoin.positiveToId === panel.id)
      negativeJoin = pJoins.find((panelJoin) => panelJoin.negativeToId === panel.id)
    })

    /*    lastValueFrom(this.panelJoinsEntity.entities$).then((panelJoins) => {
          panelJoin = panelJoins.find(
            (panelJoin) => panelJoin.positive_id === panel.id,
          )
        })*/

    const links: PanelLinks = {
      positive: positiveJoin?.negativeToId,
      negative: negativeJoin?.positiveToId,
    }

    return links
  }
}
