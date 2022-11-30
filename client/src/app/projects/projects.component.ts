import { Component, OnInit } from '@angular/core'
import { ProjectsService } from './services/projects.service'
import { Observable } from 'rxjs'
import { ProjectModel } from './models/project.model'
import { ActivatedRoute, Router } from '@angular/router'
import { Store } from '@ngrx/store'
import { AppState } from '../store/app.state'
import { selectAllProjects } from './project-id/services/store/projects/projects.selectors'
import { InvertersService } from './services/inverters.service'
import { AsyncPipe, NgIf } from '@angular/common'

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss'],
  standalone: true,
  imports: [AsyncPipe, NgIf],
})
export class ProjectsComponent implements OnInit {
  projects$: Observable<ProjectModel[]> | undefined

  constructor(
    private router: Router,
    private store: Store<AppState>,
    private projects: ProjectsService,
    private inverters: InvertersService,
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.projects
      .getUserProjects()
      .then((res) => {
        if (res) this.initState()
      })
      .catch((err) => {
        console.log(err)
      })
  }

  initState() {
    this.projects$ = this.store.select(selectAllProjects)
  }

  onRouteToProject(project: ProjectModel) {
    this.projects.getDataByProjectId(project.id).then(async () => {
      // this.inverters.getInvertersByProjectId(project.id).then(async () => {
      // await this.router.navigateByUrl(`/projects/${project.id}`);
      // this.treenodes.initTreeNode(project.id);s

      await this.router.navigate([`${project.id}`], {
        relativeTo: this.route,
      })
    })
  }
}
