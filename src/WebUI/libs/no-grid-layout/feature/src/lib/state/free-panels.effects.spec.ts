import * as FreePanelsActions from './free-panels.actions'
import { FreePanelsEffects } from './free-panels.effects'
import { TestBed } from '@angular/core/testing'
import { provideMockActions } from '@ngrx/effects/testing'
import { Action } from '@ngrx/store'
import { provideMockStore } from '@ngrx/store/testing'
import { hot } from 'jasmine-marbles'
import { Observable } from 'rxjs'

describe('FreePanelsEffects', () => {
  let actions: Observable<Action>
  let effects: FreePanelsEffects

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [FreePanelsEffects, provideMockActions(() => actions), provideMockStore()],
    })

    effects = TestBed.inject(FreePanelsEffects)
  })

  describe('init$', () => {
    it('should work', () => {
      actions = hot('-a-|', { a: FreePanelsActions.initFreePanels() })

      const expected = hot('-a-|', {
        a: FreePanelsActions.loadFreePanelsSuccess({ freePanels: [] }),
      })

      expect(effects.init$).toBeObservable(expected)
    })
  })
})
