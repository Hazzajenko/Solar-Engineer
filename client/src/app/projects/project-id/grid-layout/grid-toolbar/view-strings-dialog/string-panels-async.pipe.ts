import { Pipe, PipeTransform } from '@angular/core'
import { Observable, of } from 'rxjs'
import { map } from 'rxjs/operators'
import { PanelsEntityService } from '../../../services/ngrx-data/panels-entity/panels-entity.service'
import { StringModel } from '../../../../models/string.model'

@Pipe({
  name: 'stringPanelsAsync',
  standalone: true,
})
export class StringPanelsAsyncPipe implements PipeTransform {
  constructor(private panelsEntity: PanelsEntityService) {}

  transform(string: StringModel): Observable<number> {
    if (!string) {
      return of(0)
    }

    return this.panelsEntity.entities$.pipe(
      map((panels) => {
        const stringPanels = panels.filter((p) => p.string_id === string.id)

        return stringPanels.length
      }),
    )
  }
}
