import { PanelsFacade } from '@project-id/data-access/store'
import { map } from 'rxjs/operators'
import { Observable, of } from 'rxjs'
import { inject, Pipe, PipeTransform } from '@angular/core'
import { PanelModel } from '@shared/data-access/models'

@Pipe({
  name: 'getPanelAsync',
  standalone: true,
})
export class GetPanelAsyncPipe implements PipeTransform {
  private panelsFacade = inject(PanelsFacade)
  transform(id: string): Observable<PanelModel | undefined> {
    if (!id) {
      console.log('noblocks')
      return of(undefined)
    }
    return this.panelsFacade.panelById$(id)
  }
}
