import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { ProjectModel } from '../models/project.model'
import { environment } from '../../../environments/environment'
import { Store } from '@ngrx/store'
import { AppState } from '../../store/app.state'
import {
  addUserProjects,
  selectProject,
} from '../project-id/services/store/projects/projects.actions'
import { InverterModel } from '../models/inverter.model'
import { TrackerModel } from '../models/tracker.model'
import { StringModel } from '../models/string.model'
import { addInvertersByProjectId } from '../store/inverters/inverters.actions'
import { addTrackers } from '../store/trackers/trackers.actions'
import { addStringsByProjectId } from '../store/strings/strings.actions'
import { PanelModel } from '../models/panel.model'
import { selectProjectByRouteParams } from '../project-id/services/store/projects/projects.selectors'
import { CableModel } from '../models/cable.model'

export interface ProjectsEnvelope {
  projects: ProjectModel[]
}

export interface ProjectEnvelope {
  project: ProjectModel
}

export interface ProjectDataEnvelope {
  project: ProjectModel
  inverters: InverterModel[]
  trackers: TrackerModel[]
  stringsByProjectId: StringModel[]
  panels: PanelModel[]
  cables: CableModel[]
}

@Injectable({
  providedIn: 'root',
})
export class ProjectsService {
  getProject = this.store.select(selectProjectByRouteParams)

  constructor(private http: HttpClient, private store: Store<AppState>) {}

  /*    private store: Store<AppState>,
        private inverters: InvertersService*/

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
              addUserProjects({ projects: envelope.projects }),
            )
            resolve(envelope)
          },
          error: (err) => {
            reject(err)
          },
          complete: () => {
            console.log('getUserProjects')
          },
        }),
    )
  }

  getProjectById(projectId: number): Promise<ProjectEnvelope> {
    return new Promise<ProjectEnvelope>((resolve, reject) =>
      this.http
        .get<ProjectEnvelope>(environment.apiUrl + `/projects/${projectId}`)
        .subscribe({
          next: (envelope) => {
            this.store.dispatch(selectProject({ project: envelope.project }))
            resolve(envelope)
          },
          error: (err) => {
            reject(err)
          },
          complete: () => {
            console.log('getProjectById')
          },
        }),
    )
  }

  getDataByProjectId(projectId: number): Promise<ProjectDataEnvelope> {
    return new Promise<ProjectDataEnvelope>((resolve, reject) =>
      this.http
        .get<ProjectDataEnvelope>(
          environment.apiUrl + `/projects/${projectId}/all`,
        )
        .subscribe({
          next: (envelope) => {
            this.store.dispatch(selectProject({ project: envelope.project }))
            resolve(envelope)
            this.store.dispatch(
              addInvertersByProjectId({ inverters: envelope.inverters }),
            )
            this.store.dispatch(addTrackers({ trackers: envelope.trackers }))
            this.store.dispatch(
              addStringsByProjectId({
                stringModels: envelope.stringsByProjectId,
              }),
            )
            envelope.panels.forEach((panel) => {
              panel.open_circuit_voltage = Number(panel.open_circuit_voltage)
              panel.current_at_maximum_power = Number(
                panel.current_at_maximum_power,
              )
              panel.short_circuit_current = Number(panel.short_circuit_current)
              panel.short_circuit_current_temp = Number(
                panel.short_circuit_current_temp,
              )
              panel.maximum_power = Number(panel.maximum_power)
              panel.maximum_power_temp = Number(panel.maximum_power_temp)
              panel.voltage_at_maximum_power = Number(
                panel.voltage_at_maximum_power,
              )
              panel.open_circuit_voltage_temp = Number(
                panel.open_circuit_voltage_temp,
              )
              panel.weight = Number(panel.weight)
            }) /*
            this.store.dispatch(
              PanelStateActions.addManyPanels({
                panels: envelope.panels,
              }),
            )*/
            /*            this.store.dispatch(
                          CableStateActions.addManyCables({
                            cables: envelope.cables,
                          }),
                        )*/
            // const blocks: BlockModel[] = []
            /*            const panelsToBlocks = envelope.panels.map((panel) => {
                          const block: BlockModel = {
                            id: panel.location,
                            project_id: panel.project_id!,
                            item_id: panel.id,
                            model: UnitModel.PANEL,
                          }
                          return block
                        })
                        const cablesToBlocks = envelope.cables.map((cable) => {
                          const block: BlockModel = {
                            id: cable.location,
                            project_id: cable.project_id!,
                            item_id: cable.id,
                            model: UnitModel.CABLE,
                          }
                          return block
                        })*/
            /*            console.log(panelsToBlocks)
                        console.log(cablesToBlocks)
                        blocks.concat(panelsToBlocks)
                        blocks.concat(cablesToBlocks)*/
            /*            panelsToBlocks.concat(cablesToBlocks)
                        this.store.dispatch(
                          BlocksStateActions.addManyBlocksForGrid({
                            blocks: panelsToBlocks,
                          }),
                        )
                        this.store.dispatch(
                          BlocksStateActions.addManyBlocksForGrid({
                            blocks: cablesToBlocks,
                          }),
                        )*/

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

            resolve(envelope)
          },
          error: (err) => {
            reject(err)
          },
          complete: () => {
            console.log('getDataByProjectId')
          },
        }),
    )
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
