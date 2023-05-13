import { inject, Pipe, PipeTransform } from '@angular/core'
import { GridPanelsFacade } from '@grid-layout/data-access'
import { GridStringModel } from '@shared/data-access/models'
import { Observable, of } from 'rxjs'
import { map } from 'rxjs/operators'

@Pipe({
  name:       'stringPanelsAsync',
  standalone: true,
})
export class StringPanelsAsyncPipe
  implements PipeTransform {
  private panelsFacade = inject(GridPanelsFacade)

  transform(string: GridStringModel): Observable<number> {
    if (!string) {
      return of(0)
    }

    return this.panelsFacade.allPanels$.pipe(
      map((panels) => {
        const stringPanels = panels.filter((p) => p.stringId === string.id)

        return stringPanels.length
      }),
    )
  }
}
