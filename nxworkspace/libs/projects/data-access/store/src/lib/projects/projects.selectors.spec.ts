import { ProjectModel } from '@shared/data-access/models'
import { initialProjectsState, projectsAdapter, ProjectsPartialState } from './projects.reducer'
import * as ProjectsSelectors from './projects.selectors'

describe('Projects Selectors', () => {
  const ERROR_MSG = 'No Error Available'
  const getProjectsId = (it: ProjectModel) => it.id
  const createProjectsEntity = (id: number, name = '') =>
    ({
      id,
      name: name || `name-${id}`,
    } as ProjectModel)

  let state: ProjectsPartialState

  beforeEach(() => {
    state = {
      projects: projectsAdapter.setAll(
        [createProjectsEntity(1), createProjectsEntity(2), createProjectsEntity(3)],
        {
          ...initialProjectsState,
          selectedId: 2,
          error: ERROR_MSG,
          loaded: true,
        },
      ),
    }
  })

  describe('Projects Selectors', () => {
    it('selectAllProjects() should return the list of Projects', () => {
      const results = ProjectsSelectors.selectAllProjects(state)
      const selId = getProjectsId(results[1])

      expect(results.length).toBe(3)
      expect(selId).toBe(2)
    })

    it('selectEntity() should return the selected Entity', () => {
      const result = ProjectsSelectors.selectEntity(state) as ProjectModel
      const selId = getProjectsId(result)

      expect(selId).toBe(2)
    })

    it('selectProjectsLoaded() should return the current "loaded" status', () => {
      const result = ProjectsSelectors.selectProjectsLoaded(state)

      expect(result).toBe(true)
    })

    it('selectProjectsError() should return the current "error" state', () => {
      const result = ProjectsSelectors.selectProjectsError(state)

      expect(result).toBe(ERROR_MSG)
    })
  })
})
