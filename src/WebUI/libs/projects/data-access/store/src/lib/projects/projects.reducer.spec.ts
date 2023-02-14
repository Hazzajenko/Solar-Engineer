import { Action } from '@ngrx/store'
import { ProjectModel } from '@shared/data-access/models'

import { ProjectsActions } from './projects.actions'

import { initialProjectsState, projectsReducer, ProjectsState } from './projects.reducer'

describe('Projects Reducer', () => {
  const createProjectsEntity = (id: number, name = ''): ProjectModel => ({
    id,
    name: name || `name-${id}`,
    createdAt: '123456',
    createdBy: 1,
  })

  describe('valid Projects actions', () => {
    it('loadProjectsSuccess should return the list of known Projects', () => {
      const projects = [createProjectsEntity(1), createProjectsEntity(2)]
      const action = ProjectsActions.loadProjectsSuccess({ projects })

      const result: ProjectsState = projectsReducer(initialProjectsState, action)

      expect(result.loaded).toBe(true)
      expect(result.ids.length).toBe(2)
    })
  })

  describe('unknown action', () => {
    it('should return the previous state', () => {
      const action = {} as Action

      const result = projectsReducer(initialProjectsState, action)

      expect(result).toBe(initialProjectsState)
    })
  })
})
