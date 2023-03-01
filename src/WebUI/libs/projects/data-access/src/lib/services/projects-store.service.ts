import { inject, Injectable } from '@angular/core'
import { ProjectsFacade } from './projects.facade'
import { ProjectsRepository } from './projects.repository'

@Injectable({ providedIn: 'root' })
export class ProjectsStoreService {
  public select = inject(ProjectsFacade)
  public dispatch = inject(ProjectsRepository)
}
