import * as ProjectsActions from './projects.actions'
import { createReducer, on } from '@ngrx/store'
import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity'
import { ProjectModel } from '@shared/data-access/models'

export const selectProjectId = (b: ProjectModel): number => b.id
export const sortByProjectName = (a: ProjectModel, b: ProjectModel): number =>
  a.name.localeCompare(b.name)

export const projectAdapter: EntityAdapter<ProjectModel> = createEntityAdapter<ProjectModel>({
  selectId: selectProjectId,
  sortComparer: sortByProjectName,
})

export const initialProjectsState = projectAdapter.getInitialState({
  currentProjectId: 1,
})

export const projectsReducer = createReducer(
  initialProjectsState,

  on(ProjectsActions.addUserProjects, (state, { projects }) =>
    projectAdapter.addMany(projects, state),
  ),

  on(ProjectsActions.selectProject, (state, action) =>
    projectAdapter.setOne(action.project, {
      ...state,
      currentProjectId: action.project.id,
    }),
  ),

  on(ProjectsActions.modifiedProject, (state, action) =>
    projectAdapter.updateOne(
      {
        id: action.project.id,
        changes: action.project,
      },
      state,
    ),
  ),

  on(ProjectsActions.removeProject, (state, action) =>
    projectAdapter.removeOne(action.project.id, state),
  ),

  on(ProjectsActions.clearProjectsState, (state, action) => projectAdapter.removeAll(state)),
)

export const { selectIds, selectEntities } = projectAdapter.getSelectors()

// export type ProjectState = EntityState<ProjectModel>

export interface ProjectState extends EntityState<ProjectModel> {
  currentProjectId: number
}
