import { StatsService } from '@grid-layout/data-access/services'
import { inject, Pipe, PipeTransform } from '@angular/core'
import { Observable, of } from 'rxjs'
import { map } from 'rxjs/operators'
import { PanelsFacade } from '@project-id/data-access/facades'
import { StringModel, TotalModel } from '@shared/data-access/models'


@Pipe({
  name: 'stringTotalsAsync',
  standalone: true,
})
export class StringTotalsAsyncPipe implements PipeTransform {
  private statsService = inject(StatsService)
  private panelsFacade = inject(PanelsFacade)

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

    return this.panelsFacade.allPanels$.pipe(
      map((panels) => {
        const stringPanels = panels.filter((p) => p.stringId === string.id)

        return this.statsService.calculateStringTotals(stringPanels)
      }),
    )
  }
}
