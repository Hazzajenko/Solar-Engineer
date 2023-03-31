import * as FreePanelsActions from './free-panels.actions'
import { FreePanelsEntity } from './free-panels.models'
import { FreePanelsState, initialFreePanelsState, freePanelsReducer } from './free-panels.reducer'
import { Action } from '@ngrx/store'

describe('FreePanels Reducer', () => {
  const createFreePanelsEntity = (id: string, name = ''): FreePanelsEntity => ({
    id,
    name: name || `name-${id}`,
  })

  describe('valid FreePanels actions', () => {
    it('loadFreePanelsSuccess should return the list of known FreePanels', () => {
      const freePanels = [
        createFreePanelsEntity('PRODUCT-AAA'),
        createFreePanelsEntity('PRODUCT-zzz'),
      ]
      const action = FreePanelsActions.loadFreePanelsSuccess({ freePanels })

      const result: FreePanelsState = freePanelsReducer(initialFreePanelsState, action)

      expect(result.loaded).toBe(true)
      expect(result.ids.length).toBe(2)
    })
  })

  describe('unknown action', () => {
    it('should return the previous state', () => {
      const action = {} as Action

      const result = freePanelsReducer(initialFreePanelsState, action)

      expect(result).toBe(initialFreePanelsState)
    })
  })
})
