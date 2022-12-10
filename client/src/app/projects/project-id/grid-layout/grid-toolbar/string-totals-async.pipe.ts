import { Pipe, PipeTransform } from '@angular/core'
import { Observable, of } from 'rxjs'
import { map } from 'rxjs/operators'
import { StringModel } from '../../../models/string.model'
import { StatsService, TotalModel } from '../../services/stats.service'
import { PanelsEntityService } from '../../services/ngrx-data/panels-entity/panels-entity.service'

@Pipe({
  name: 'stringTotalsAsync',
  standalone: true,
})
export class StringTotalsAsyncPipe implements PipeTransform {
  constructor(private panelsEntity: PanelsEntityService, private statsService: StatsService) {}

  transform(string: StringModel): Observable<TotalModel> {
    if (!string) {
      const totals: TotalModel = {
        totalImp: 0,
        totalIsc: 0,
        totalPmax: 0,
        totalVmp: 0,
        totalVoc: 0,
      }
      return of(totals)
    }

    return this.panelsEntity.entities$.pipe(
      map((panels) => {
        const stringPanels = panels.filter((p) => p.stringId === string.id)

        return this.statsService.calculateStringTotals(string, stringPanels)
      }),
    )
  }
}
