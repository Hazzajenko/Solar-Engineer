import { inject, Injectable } from '@angular/core'
import { ProjectsFacade } from './projects.facade'
import { ProjectsRepository } from './projects.repository'

// import { ProjectsHub } from './projects.hub'

@Injectable({ providedIn: 'root' })
export class ProjectsStoreService {
  public select = inject(ProjectsFacade)
  // public invoke = inject(ProjectsHub)
  public dispatch = inject(ProjectsRepository)
}
