import { CommonModule } from '@angular/common'
import { Component, inject } from '@angular/core'
import { BlocksFacade } from '@project-id/data-access/store'
import { GridLayoutComponent } from '@grid-layout/feature'
import { ToolbarComponent } from '@project-id/feature/toolbar'

import { ProjectsFacade } from '@projects/data-access/store'
import { BlockModel, ProjectModel } from '@shared/data-access/models'
import { Observable } from 'rxjs'

@Component({
  selector: 'app-local-project',
  standalone: true,
  imports: [CommonModule, GridLayoutComponent, ToolbarComponent],
  templateUrl: './local-project.component.html',
  styles: [],
})
export class LocalProjectComponent {
  private store = inject(ProjectsFacade)

  project$: Observable<ProjectModel | undefined> = this.store.projectFromRoute$
  blocks$: Observable<BlockModel[]> = inject(BlocksFacade).blocksFromRoute$
  rows = 20
  cols = 40
  constructor() {
    this.store.projectFromRoute$.subscribe((res) => console.log(res))
  }
}
