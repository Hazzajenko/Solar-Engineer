import { inject, Injectable } from '@angular/core'
import { Resolve } from '@angular/router'
import { ProjectsStoreService } from '@projects/data-access/facades'
import { EMPTY, of } from 'rxjs'
import { switchMap } from 'rxjs/operators'

@Injectable({
  providedIn: 'root',
})
export class LocalProjectResolver implements Resolve<void> {
  private projectsStore = inject(ProjectsStoreService)

  resolve() {
    return this.projectsStore.select.localProject$.pipe(
      switchMap((localProject) => {
        if (!localProject) return of(this.projectsStore.dispatch.initLocalProject())
        else return EMPTY
      }),
    )
  }
}
