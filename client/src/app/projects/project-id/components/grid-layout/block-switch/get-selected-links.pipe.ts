import { PanelJoinModel } from './../../../../models/panel-join.model'
import { SelectedModel } from './../../../../models/selected.model'
import { Pipe, PipeTransform } from '@angular/core'
import { LoggerService } from 'src/app/services/logger.service'
import { PanelLinkModel } from 'src/app/projects/models/panel-link.model'
import { UnitModel } from 'src/app/projects/models/unit.model'

@Pipe({
  name: 'getSelectedLinks',
  standalone: true,
})
export class GetSelectedLinksPipe implements PipeTransform {
  constructor(private logger: LoggerService) {}

  transform(
    selected?: SelectedModel,
    panelJoins?: PanelJoinModel[],
  ): PanelLinkModel {
    if (!selected || !panelJoins) {
      this.logger.error('err GetSelectedLinksPipe')
      return {
        selectedPositiveLinkTo: undefined,
        selectedNegativeLinkTo: undefined,
      } as PanelLinkModel
    }
    if (selected) {
      switch (selected.unit) {
        case UnitModel.PANEL:
          if (panelJoins) {
            const positive = panelJoins.find(
              (pJoin) => pJoin.negative_id === selected.singleSelectId,
            )?.positive_id
            const negative = panelJoins.find(
              (pJoin) => pJoin.positive_id === selected.singleSelectId,
            )?.negative_id
            return {
              selectedPositiveLinkTo: positive,
              selectedNegativeLinkTo: negative,
            } as PanelLinkModel
          }
          break
        case UnitModel.DISCONNECTIONPOINT:
          if (panelJoins) {
            const positive = panelJoins.find(
              (pJoin) => pJoin.negative_id === selected.singleSelectId,
            )?.positive_id
            const negative = panelJoins.find(
              (pJoin) => pJoin.positive_id === selected.singleSelectId,
            )?.negative_id
            return {
              selectedPositiveLinkTo: positive,
              selectedNegativeLinkTo: negative,
            } as PanelLinkModel
          }
          break
      }
    }
    return {
      selectedPositiveLinkTo: undefined,
      selectedNegativeLinkTo: undefined,
    } as PanelLinkModel
  }
}
