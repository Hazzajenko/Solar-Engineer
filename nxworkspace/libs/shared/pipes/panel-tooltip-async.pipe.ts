import { Pipe, PipeTransform } from '@angular/core'
import { PanelModel } from '../../../../../../../../../libs/shared/data-access/models/src/lib/panel.model'
import { StringsEntityService } from '../../../services/ngrx-data/strings-entity/strings-entity.service'
import { Observable, of } from 'rxjs'
import { map } from 'rxjs/operators'

@Pipe({
  name: 'panelTooltipAsync',
  standalone: true,
})
export class PanelTooltipAsyncPipe implements PipeTransform {
  constructor(private stringsEntity: StringsEntityService) {}

  transform(panel: PanelModel): Observable<string> {
    if (!panel) {
      return of('')
    }

    return this.stringsEntity.entities$.pipe(
      map((strings) => strings.find((s) => s.id === panel.stringId)),
      map((string) => string!.name),
    )

    /*    firstValueFrom(this.store.select(selectMultiSelectIds)).then(multiSelectIds => {
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
