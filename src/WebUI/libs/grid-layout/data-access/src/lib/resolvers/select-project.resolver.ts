import { inject, Injectable } from '@angular/core'
import { Resolve } from '@angular/router'
import { ProjectsStoreService } from '@projects/data-access'
import { EMPTY, of } from 'rxjs'
import { switchMap } from 'rxjs/operators'

@Injectable({
  providedIn: 'root',
})
export class SelectProjectResolver implements Resolve<void> {
  private projectsStore = inject(ProjectsStoreService)

  resolve() {
    return this.projectsStore.select.projectFromRoute$.pipe(
      switchMap((project) => {
        if (project) return of(this.projectsStore.dispatch.initSelectProject(project.id))
        else return EMPTY
      }),
    )
  }
}
