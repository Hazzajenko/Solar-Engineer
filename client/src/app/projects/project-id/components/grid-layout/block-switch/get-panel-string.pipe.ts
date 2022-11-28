import { StringModel } from './../../../../models/string.model'
import { PanelModel } from './../../../../models/panel.model'
import { Pipe, PipeTransform } from '@angular/core'
import { LoggerService } from 'src/app/services/logger.service'

@Pipe({
  name: 'getPanelString',
  standalone: true,
})
export class GetPanelStringPipe implements PipeTransform {
  constructor(private logger: LoggerService) {}

  transform(
    panel?: PanelModel,
    panels?: PanelModel[],
    strings?: StringModel[],
  ) {
    if (!panel || !panels || !strings) {
      this.logger.error('err getPanelByLocation')
      return undefined
    }
    const panelString = strings.find((string) => string.id === panel.string_id)
    if (!panelString) {
      this.logger.error('err getPanelByLocation')
      return undefined
    }
    return panelString
  }
}
