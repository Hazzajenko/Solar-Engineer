import { FreePanelsEntity } from './free-panels.models'
import {
  freePanelsAdapter,
  FreePanelsPartialState,
  initialFreePanelsState,
} from './free-panels.reducer'
import * as FreePanelsSelectors from './free-panels.selectors'

describe('FreePanels Selectors', () => {
  const ERROR_MSG = 'No Error Available'
  const getFreePanelsId = (it: FreePanelsEntity) => it.id
  const createFreePanelsEntity = (id: string, name = '') =>
    ({
      id,
      name: name || `name-${id}`,
    } as FreePanelsEntity)

  let state: FreePanelsPartialState

  beforeEach(() => {
    state = {
      freePanels: freePanelsAdapter.setAll(
        [
          createFreePanelsEntity('PRODUCT-AAA'),
          createFreePanelsEntity('PRODUCT-BBB'),
          createFreePanelsEntity('PRODUCT-CCC'),
        ],
        {
          ...initialFreePanelsState,
          selectedId: 'PRODUCT-BBB',
          error: ERROR_MSG,
          loaded: true,
        },
      ),
    }
  })

  describe('FreePanels Selectors', () => {
    it('selectAllFreePanels() should return the list of FreePanels', () => {
      const results = FreePanelsSelectors.selectAllFreePanels(state)
      const selId = getFreePanelsId(results[1])

      expect(results.length).toBe(3)
      expect(selId).toBe('PRODUCT-BBB')
    })

    it('selectEntity() should return the selected Entity', () => {
      const result = FreePanelsSelectors.selectEntity(state) as FreePanelsEntity
      const selId = getFreePanelsId(result)

      expect(selId).toBe('PRODUCT-BBB')
    })

    it('selectFreePanelsLoaded() should return the current "loaded" status', () => {
      const result = FreePanelsSelectors.selectFreePanelsLoaded(state)

      expect(result).toBe(true)
    })

    it('selectFreePanelsError() should return the current "error" state', () => {
      const result = FreePanelsSelectors.selectFreePanelsError(state)

      expect(result).toBe(ERROR_MSG)
    })
  })
})
