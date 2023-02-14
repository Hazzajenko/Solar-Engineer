import { TestBed } from '@angular/core/testing'
import { provideMockActions } from '@ngrx/effects/testing'
import { Action } from '@ngrx/store'
import { provideMockStore } from '@ngrx/store/testing'
import { hot } from 'jasmine-marbles'
import { Observable } from 'rxjs'

import { ProjectsActions } from './projects.actions'
import { ProjectsEffects } from './projects.effects'

describe('ProjectsEffects', () => {
  let actions: Observable<Action>
  let effects: ProjectsEffects

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [ProjectsEffects, provideMockActions(() => actions), provideMockStore()],
    })

    effects = TestBed.inject(ProjectsEffects)
  })

  describe('init$', () => {
    it('should work', () => {
      actions = hot('-a-|', { a: ProjectsActions.initProjects() })

      const expected = hot('-a-|', { a: ProjectsActions.loadProjectsSuccess({ projects: [] }) })

      expect(effects.init$).toBeObservable(expected)
    })
  })
})
