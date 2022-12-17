import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity'
import { createReducer, on } from '@ngrx/store'
import * as UserProjectsActions from './user-projects.actions'
import { UserProjectModel } from '../../models/deprecated-for-now/user-project.model'

export const selectUserProjectId = (b: UserProjectModel): number => b.userId

export const userProjectAdapter: EntityAdapter<UserProjectModel> =
  createEntityAdapter<UserProjectModel>({
    selectId: selectUserProjectId,
  })

export const initialUserProjectsState = userProjectAdapter.getInitialState({})

export const userProjectsReducer = createReducer(
  initialUserProjectsState,

  on(UserProjectsActions.addUserProject, (state, { userProject }) =>
    userProjectAdapter.addOne(userProject, state),
  ),

  on(UserProjectsActions.addUserProjects, (state, { userProjects }) =>
    userProjectAdapter.addMany(userProjects, state),
  ),
)

export const { selectIds, selectEntities, selectAll } = userProjectAdapter.getSelectors()

export type UserProjectState = EntityState<UserProjectModel>
