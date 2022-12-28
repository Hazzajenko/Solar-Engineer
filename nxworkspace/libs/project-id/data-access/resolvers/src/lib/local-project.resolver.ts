import { inject, Injectable } from '@angular/core'
import { Resolve } from '@angular/router'
import { ProjectsFacade } from '@projects/data-access/store'
import { EMPTY, of } from 'rxjs'
import { switchMap } from 'rxjs/operators'

@Injectable({
  providedIn: 'root',
})
export class LocalProjectResolver implements Resolve<void> {
  private projectsFacade = inject(ProjectsFacade)
  resolve() {
    return this.projectsFacade.localProject$.pipe(
      switchMap((localProject) => {
        if (!localProject) return of(this.projectsFacade.initLocalProject())
        else return EMPTY
      }),
    )
  }
}
