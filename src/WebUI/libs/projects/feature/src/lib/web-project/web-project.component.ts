import { CommonModule } from '@angular/common'
import { Component, inject } from '@angular/core'
import { GridLayoutComponent } from '@grid-layout/feature'
import { ProjectsStoreService } from '@projects/data-access'
import { BlockModel, ProjectModel } from '@shared/data-access/models'
import { Observable } from 'rxjs'
import { BlocksStoreService } from '@grid-layout/data-access'

@Component({
  selector: 'app-web-project',
  standalone: true,
  imports: [CommonModule, GridLayoutComponent],
  templateUrl: './web-project.component.html',
  styles: [],
})
export class WebProjectComponent {
  private projectsStore = inject(ProjectsStoreService)
  private blocksStore = inject(BlocksStoreService)
  rows = 20
  cols = 40

  project$: Observable<ProjectModel | undefined> = this.projectsStore.select.projectNameFromRoute$
  // blocks$: Observable<BlockModel[]> = new Observable<BlockModel[]>()
  // hi = this.projectsStore.select.
  blocks$: Observable<BlockModel[]> = this.blocksStore.select.blocksFromProject$
}
