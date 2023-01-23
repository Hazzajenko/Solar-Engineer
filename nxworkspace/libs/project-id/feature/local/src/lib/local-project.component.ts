import { CommonModule } from '@angular/common'
import { ChangeDetectionStrategy, Component, inject } from '@angular/core'
import { MatSnackBarModule } from '@angular/material/snack-bar'
import { GridLayoutComponent } from '@grid-layout/feature/index'
import { KeymapOverlayComponent } from '@grid-layout/feature/keymap'
import { BlocksFacade } from '@project-id/data-access/facades'
import { ToolbarComponent } from '@project-id/feature/toolbar'

import { ProjectsFacade } from '@projects/data-access/facades'
import { BlockModel, ProjectModel } from '@shared/data-access/models'
import { Observable } from 'rxjs'

@Component({
  selector: 'app-local-project',
  standalone: true,
  imports: [CommonModule, GridLayoutComponent, ToolbarComponent, MatSnackBarModule, KeymapOverlayComponent],
  providers: [MatSnackBarModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [MatSnackBarModule],
  templateUrl: './local-project.component.html',
  styles: [],
})
export class LocalProjectComponent {
  project$: Observable<ProjectModel | undefined> = inject(ProjectsFacade).projectFromRoute$
  blocks$: Observable<BlockModel[]> = inject(BlocksFacade).blocksFromRoute$
  // rows = 40
  // rows = 20
  rows = 28
  cols = 37 + 14

  /*  rows = 28
    cols = 37*/
  /* rows = 150
   // cols = 40
   cols = 150*/
  /*  rows = 30
    // cols = 40
    cols = 60*/
}
