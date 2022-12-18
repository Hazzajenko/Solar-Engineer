import { Pipe, PipeTransform } from '@angular/core'
import { Observable, of } from 'rxjs'
import { map } from 'rxjs/operators'
import { StringModel, TotalModel } from '@shared/data-access/models'
import { StatsService } from '@grid-layout/data-access/api'
import { PanelsEntityService } from '@grid-layout/data-access/store'


@Pipe({
  name: 'getStringStats',
  standalone: true,
})
export class GetStringStatsPipe implements PipeTransform {
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
