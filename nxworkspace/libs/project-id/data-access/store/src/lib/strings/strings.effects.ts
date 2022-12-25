import { inject, Injectable } from '@angular/core'
import { Actions } from '@ngrx/effects'
import { ProjectsService } from '@projects/data-access/api'

@Injectable({
  providedIn: 'root',
})
export class StringsEffects {
  private actions$ = inject(Actions)
  private projectsService = inject(ProjectsService)
}
