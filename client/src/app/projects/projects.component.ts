import { Component, inject } from '@angular/core'
import { CommonModule } from '@angular/common'
import { ProjectsStore } from './data-access/projects.store'

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss'],
})
export class ProjectsComponent {
  private store = inject(ProjectsStore)


}
