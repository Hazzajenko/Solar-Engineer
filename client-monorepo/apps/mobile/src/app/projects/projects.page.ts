import {Component, inject, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {ProjectModel, UserModel} from "@shared/models";
import {IonicModule} from "@ionic/angular";
import {AsyncPipe, DatePipe, NgForOf, NgIf, SlicePipe} from "@angular/common";
import {ProjectsStore} from "@projects/api";
import {Observable} from "rxjs";
import {AuthFacade} from "@auth/facade";


@Component({
  selector: 'app-projects',
  templateUrl: './projects.page.html',
  styleUrls: ['./projects.page.scss'],
  imports: [
    IonicModule,
    NgIf,
    NgForOf,
    AsyncPipe,
    SlicePipe,
    DatePipe
  ],
  providers: [
    ProjectsStore
  ],
  standalone: true
})
export class ProjectsPage implements OnInit {
  private store = inject(ProjectsStore)
  projects$: Observable<ProjectModel[] | undefined> = this.store.userProjects$
  private auth = inject(AuthFacade)
  user$: Observable<UserModel | undefined> = this.auth.user$
  private router = inject(Router)

  ngOnInit() {

  }


  routeToProject(project: ProjectModel) {
    /*    this.getService
          .selectProject(project)
          .then(async () => {
            await this.router.navigateByUrl(`/project/${project.id}`);
          })
          .catch((err) => {
            console.log(err);
          });*/
  }
}
