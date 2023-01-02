import { MatSnackBarModule, MatSnackBarRef } from '@angular/material/snack-bar'
import { CommonModule } from '@angular/common'
import { Component, inject } from '@angular/core'
import { BlocksFacade } from '@project-id/data-access/facades'
import { GridLayoutComponent } from '@grid-layout/feature/index'
import { ToolbarComponent } from '@project-id/feature/toolbar'

import { ProjectsFacade } from '@projects/data-access/facades'
import { BlockModel, ProjectModel } from '@shared/data-access/models'
import { Observable } from 'rxjs'

@Component({
  selector: 'app-local-project',
  standalone: true,
  imports: [CommonModule, GridLayoutComponent, ToolbarComponent, MatSnackBarModule],
  providers: [MatSnackBarModule],
  viewProviders: [MatSnackBarModule],
  templateUrl: './local-project.component.html',
  styles: [],
})
export class LocalProjectComponent {
  project$: Observable<ProjectModel | undefined> = inject(ProjectsFacade).projectFromRoute$
  blocks$: Observable<BlockModel[]> = inject(BlocksFacade).blocksFromRoute$
  rows = 20
  cols = 40
}
