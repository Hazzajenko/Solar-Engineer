import { CommonModule } from '@angular/common'
import { Component, inject } from '@angular/core'
import { BlocksFacade } from '@project-id/data-access/store'
import { GridLayoutComponent } from '@grid-layout/feature/index'
import { ToolbarComponent } from '@project-id/feature/toolbar'

import { ProjectsFacade } from '@projects/data-access/store'
import { BlockModel, ProjectModel } from '@shared/data-access/models'
import { Observable } from 'rxjs'

@Component({
  selector: 'app-web-project',
  standalone: true,
  imports: [CommonModule, GridLayoutComponent, ToolbarComponent],
  templateUrl: './web-project.component.html',
  styles: [],
})
export class WebProjectComponent {
  private store = inject(ProjectsFacade)
  rows = 20
  cols = 40

  project$: Observable<ProjectModel | undefined> = this.store.projectFromRoute$
  blocks$: Observable<BlockModel[]> = inject(BlocksFacade).blocksFromRoute$
}
