import { Pipe, PipeTransform } from '@angular/core'
import { Observable } from 'rxjs'
import { PanelModel } from '../../../../../libs/shared/data-access/models/src/lib/panel.model'
import { map } from 'rxjs/operators'

@Pipe({
  name: 'getPanel',
  standalone: true,
})
export class GetPanelPipe implements PipeTransform {
  constructor() {}

  transform(panels: Observable<PanelModel[]>, location: string) {
    return panels.pipe(
      map((panels) => {
        return panels.find((p) => p.location === location)
      }),
    )
  }
}
