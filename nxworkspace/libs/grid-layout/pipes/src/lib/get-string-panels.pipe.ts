import { Pipe, PipeTransform } from '@angular/core'
import { Observable, of } from 'rxjs'
import { map } from 'rxjs/operators'
import { PanelsEntityService } from '@grid-layout/data-access/store'
import { StringModel } from '@shared/data-access/models'


@Pipe({
  name: 'getStringPanels',
  standalone: true,
})
export class GetStringPanelsPipe implements PipeTransform {
  constructor(private panelsEntity: PanelsEntityService) {}

  transform(string: StringModel): Observable<number> {
    if (!string) {
      return of(0)
    }

    return this.panelsEntity.entities$.pipe(
      map((panels) => {
        const stringPanels = panels.filter((p) => p.stringId === string.id)

        return stringPanels.length
      }),
    )
  }
}
