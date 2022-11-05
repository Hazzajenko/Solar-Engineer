import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ProjectModel } from '../projects-models/project.model';
import { environment } from '../../../environments/environment';
import { Store } from '@ngrx/store';
import { AppState } from '../../store/app.state';
import { addUserProjects } from '../projects-store/projects/projects.actions';

export interface ProjectsEnvelope {
  projects: ProjectModel[];
}

@Injectable({
  providedIn: 'root',
})
export class ProjectsService {
  constructor(
    private http: HttpClient,
    private store: Store<AppState>
  ) /*    private store: Store<AppState>,
        private inverters: InvertersService*/ {}

  /*  getUserProjects(): Observable<ProjectsEnvelope> {
      return this.http.get<ProjectsEnvelope>(environment.apiUrl + '/projects');
    }*/

  getUserProjects(): Promise<ProjectsEnvelope> {
    return new Promise<ProjectsEnvelope>((resolve, reject) =>
      this.http
        .get<ProjectsEnvelope>(environment.apiUrl + '/projects')
        .subscribe({
          next: (envelope) => {
            this.store.dispatch(
              addUserProjects({ projects: envelope.projects })
            );
            resolve(envelope);
          },
          error: (err) => {
            reject(err);
          },
          complete: () => {
            console.log('getUserProjects');
          },
        })
    );
  }

  /*
    getProjectById(request: ProjectModel): Promise<ProjectModel> {
      return new Promise<ProjectModel>((resolve, reject) =>
        this.http
          .get<ProjectModel>(environment.apiUrl + `/projects/${request.id}`)
          .subscribe({
            next: (project) => {
              this.store.dispatch(selectProject({ project }));
              this.inverters
                .getInvertersByProjectId(request)
                .then((res: any) => console.log(res));
              resolve(project);
            },
            error: (err: any) => {
              reject(err);
            },
            complete: () => {
              console.log('complete');
            },
          })
      );
    }*/
}
