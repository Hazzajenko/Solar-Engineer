import { Component, inject } from '@angular/core'
import { CommonModule } from '@angular/common'
import { ProjectsStore } from './data-access/projects.store'
import { Observable } from 'rxjs'
import { ProjectModel } from '../shared/models/projects/project.model'
import { MatListModule } from '@angular/material/list'
import { OneProjectPipe } from './pipes/one-project.pipe'
import { PushModule } from '@ngrx/component'
import { MatButtonModule } from '@angular/material/button'

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [CommonModule, MatListModule, OneProjectPipe, PushModule, MatButtonModule],
  providers: [ProjectsStore],
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss'],
})
export class ProjectsComponent {
  private store = inject(ProjectsStore)
  projects$: Observable<ProjectModel[]> = this.store.userProjects$

  createProject() {}
}
