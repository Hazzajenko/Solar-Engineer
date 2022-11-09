import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ProjectModel } from '../models/project.model';
import { environment } from '../../../environments/environment';
import { Store } from '@ngrx/store';
import { AppState } from '../../store/app.state';
import { addUserProjects } from '../store/projects/projects.actions';
import { InverterModel } from '../models/inverter.model';
import { TrackerModel } from '../models/tracker.model';
import { StringModel } from '../models/string.model';
import { addInvertersByProjectId } from '../store/inverters/inverters.actions';
import { addTrackers } from '../store/trackers/trackers.actions';
import { addStringsByProjectId } from '../store/strings/strings.actions';
import { TreeNodesService } from './tree-nodes.service';
import { addPanelsByProjectId } from '../store/panels/panels.actions';
import { PanelModel } from '../models/panel.model';

export interface ProjectsEnvelope {
  projects: ProjectModel[];
}

export interface ProjectDataEnvelope {
  project: ProjectModel;
  inverters: InverterModel[];
  trackers: TrackerModel[];
  stringsByProjectId: StringModel[];
  panels: PanelModel[];
}

@Injectable({
  providedIn: 'root',
})
export class ProjectsService {
  constructor(
    private http: HttpClient,
    private store: Store<AppState>,
    private treeNodes: TreeNodesService
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

  getDataByProjectId(projectId: number): Promise<ProjectDataEnvelope> {
    return new Promise<ProjectDataEnvelope>((resolve, reject) =>
      this.http
        .get<ProjectDataEnvelope>(
          environment.apiUrl + `/projects/${projectId}/all`
        )
        .subscribe({
          next: (envelope) => {
            this.store.dispatch(
              addInvertersByProjectId({ inverters: envelope.inverters })
            );
            this.store.dispatch(addTrackers({ trackers: envelope.trackers }));
            this.store.dispatch(
              addStringsByProjectId({
                stringModels: envelope.stringsByProjectId,
              })
            );
            this.store.dispatch(
              addPanelsByProjectId({
                panels: envelope.panels,
              })
            );
            /*            if (envelope.stringsByProjectId) {
                          if (envelope.stringsByProjectId.length > 1) {
                            this.store.dispatch(
                              addStringsByProjectId({
                                stringModels: envelope.stringsByProjectId,
                              })
                            );
                          }
                          envelope.stringsByProjectId.map((stringModel) => {
                            this.store.dispatch(addString({ stringModel }));
                          });
                        }*/

            resolve(envelope);
          },
          error: (err) => {
            reject(err);
          },
          complete: () => {
            console.log('getDataByProjectId');
            this.treeNodes.initTreeNode(projectId);
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
