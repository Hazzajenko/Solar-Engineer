import { Component, OnInit } from '@angular/core'
import { Observable } from 'rxjs'
import { ProjectModel } from '../shared/models/projects/project.model'
import { ActivatedRoute, Router } from '@angular/router'
import { Store } from '@ngrx/store'
import { AppState } from '../store/app.state'
import { selectAllProjects } from './project-id/services/store/projects/projects.selectors'
import { AsyncPipe, NgIf } from '@angular/common'

@Component({
  selector: 'app-projects(deprecated)',
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
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    /*    this.projects(deprecated)
          .getUserProjects()
          .then((res) => {
            if (res) this.initState()
          })
          .catch((err) => {
            console.log(err)
          })*/
  }

  initState() {
    this.projects$ = this.store.select(selectAllProjects)
  }

/*  onRouteToProject(project: ProjectModel) {
    this.projects.getDataByProjectId(project.id).then(async () => {
      // this.inverters.getInvertersByProjectId(project.id).then(async () => {
      // await this.router.navigateByUrl(`/projects(deprecated)/${project.id}`);
      // this.treenodes.initTreeNode(project.id);s

      await this.router.navigate([`${project.id}`], {
        relativeTo: this.route,
      })
    })
  }*/
}
