import { Pipe, PipeTransform } from '@angular/core'
import { PanelModel } from '../projects/models/panel.model'
import { LinkModel } from '../projects/models/link.model'
import { LinksEntityService } from '../projects/project-id/services/ngrx-data/links-entity/links-entity.service'

export interface PanelLinks {
  positive?: string
  negative?: string
}

@Pipe({
  name: 'getPanelJoin',
  standalone: true,
})
export class GetPanelJoinPipe implements PipeTransform {
  constructor(private panelJoinsEntity: LinksEntityService) {}

  transform(panel: PanelModel) {
    let positiveJoin: LinkModel | undefined
    let negativeJoin: LinkModel | undefined

    this.panelJoinsEntity.entities$.subscribe((pJoins) => {
      positiveJoin = pJoins.find(
        (panelJoin) => panelJoin.positive_id === panel.id,
      )
      negativeJoin = pJoins.find(
        (panelJoin) => panelJoin.negative_id === panel.id,
      )
    })

    /*    lastValueFrom(this.panelJoinsEntity.entities$).then((panelJoins) => {
          panelJoin = panelJoins.find(
            (panelJoin) => panelJoin.positive_id === panel.id,
          )
        })*/

    const links: PanelLinks = {
      positive: positiveJoin?.negative_id,
      negative: negativeJoin?.positive_id,
    }

    return links
  }
}
