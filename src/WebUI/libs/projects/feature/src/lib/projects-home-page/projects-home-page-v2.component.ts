import { CommonModule } from '@angular/common'
import { ChangeDetectionStrategy, Component, inject } from '@angular/core'
import { BaseService } from '@shared/logger'
import { ProjectsStoreService } from '@projects/data-access'
import { MatMenuModule } from '@angular/material/menu'

@Component({
  selector: 'app-projects-home-page-v2',
  standalone: true,
  imports: [CommonModule, MatMenuModule],
  templateUrl: './projects-home-page-v2.component.html',
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectsHomePageV2Component extends BaseService {
  private projectsStore = inject(ProjectsStoreService)
  projects$ = this.projectsStore.select.allProjects$
}
