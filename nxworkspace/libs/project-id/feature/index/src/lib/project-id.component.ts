import { ToolbarComponent } from '@project-id/feature/toolbar'
import { CommonModule } from '@angular/common'
import { Component, ElementRef, inject, ViewChild } from '@angular/core'
import { GridLayoutComponent } from '@project-id/feature/grid-layout'

import { ProjectsFacade } from '@projects/data-access/store'
import { ProjectModel } from '@shared/data-access/models'
import { Observable } from 'rxjs'

@Component({
  selector: 'app-project-id',
  standalone: true,
  imports: [CommonModule, GridLayoutComponent, ToolbarComponent],
  templateUrl: './project-id.component.html',
  styles: [],
})
export class ProjectIdComponent {
  @ViewChild('canvas', { static: true })
  canvas!: ElementRef<HTMLCanvasElement>
  private ctx!: CanvasRenderingContext2D
  private store = inject(ProjectsFacade)

  project$: Observable<ProjectModel | undefined> = this.store.projectFromRoute$
}
