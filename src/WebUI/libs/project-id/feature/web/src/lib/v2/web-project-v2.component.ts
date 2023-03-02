import { CommonModule } from '@angular/common'
import { Component, inject } from '@angular/core'
import { BlocksStoreService } from '@project-id/data-access/facades'
import { GridLayoutComponent } from '@grid-layout/feature/index'
import { ToolbarComponent } from '@project-id/feature/toolbar'

import { ProjectsFacade, ProjectsStoreService } from '@projects/data-access/facades'
import { BlockModel, ProjectModel } from '@shared/data-access/models'
// import { ProjectToolbarComponent } from 'libs/project-id/feature/web/src/lib/ui/project-toolbar.component'
import { Observable } from 'rxjs'
import { ProjectToolbarComponent } from '../ui/project-toolbar.component'

@Component({
  selector: 'app-web-project',
  standalone: true,
  imports: [CommonModule, GridLayoutComponent, ToolbarComponent, ProjectToolbarComponent],
  templateUrl: './web-project-v2.component.html',
  styles: [],
})
export class WebProjectV2Component {
  private store = inject(ProjectsFacade)
  private projectsStore = inject(ProjectsStoreService)
  private blocksStore = inject(BlocksStoreService)
  rows = 20
  cols = 40

  project$: Observable<ProjectModel | undefined> = this.projectsStore.select.projectNameFromRoute$
  blocks$: Observable<BlockModel[]> = this.blocksStore.select.blocksFromProject$
}
