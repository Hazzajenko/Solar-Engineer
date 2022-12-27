import { inject, Injectable } from '@angular/core'
import { Resolve } from '@angular/router'
import { ProjectsFacade } from '@projects/data-access/store'
import { EMPTY, of } from 'rxjs'
import { switchMap } from 'rxjs/operators'

@Injectable({
  providedIn: 'root',
})
export class SelectProjectResolver implements Resolve<void> {
  private projectsFacade = inject(ProjectsFacade)
  resolve() {
    return this.projectsFacade.projectFromRoute$.pipe(
      switchMap((project) => {
        if (project) return of(this.projectsFacade.initSelectProject(project.id))
        else return EMPTY
      }),
    )
  }
}
