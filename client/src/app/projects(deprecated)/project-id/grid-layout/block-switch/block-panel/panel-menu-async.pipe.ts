import { Pipe, PipeTransform } from '@angular/core'
import { TraysEntityService } from '../../../services/ngrx-data/trays-entity/trays-entity.service'
import { PanelModel } from '../../../../models/panel.model'
import { Store } from '@ngrx/store'

@Pipe({
  name: 'panelMenuAsync',
  standalone: true,
})
export class PanelMenuAsyncPipe implements PipeTransform {
  constructor(private traysEntity: TraysEntityService, private store: Store) {}

  transform(panel: PanelModel) {
    /*    firstValueFrom(this.store(deprecated).select(selectMultiSelectIds)).then(multiSelectIds => {
          if (multiSelectIds?.includes(panel.id)) {

          }
        })

        return this.traysEntity.entities$.pipe(
          map((cables) => {
            const findTop = cables.find((cable) => cable.location === topString)
            const findBottom = cables.find(
              (cable) => cable.location === bottomString,
            )
            const findLeft = cables.find((cable) => cable.location === leftString)
            const findRight = cables.find((cable) => cable.location === rightString)

            return {
              left: !!findLeft,
              right: !!findRight,
              top: !!findTop,
              bottom: !!findBottom,
            } as SurroundingModel
          }),
        )*/
  }
}
