import { injectPanelsStore } from './panels.store'

describe('injectPanelsStore', () => {
	it('should return the correct object', () => {
		const storeMock = {
			select: jest.fn(),
			selectSignal: jest.fn(),
			dispatch: jest.fn(),
		}
		const allPanelsMock = [
			{ id: '1', name: 'Panel 1' },
			{ id: '2', name: 'Panel 2' },
		]
		const entitiesMock = { '1': { id: '1', name: 'Panel 1' }, '2': { id: '2', name: 'Panel 2' } }

		jest.spyOn(storeMock, 'select').mockReturnValue(allPanelsMock)
		jest.spyOn(storeMock, 'selectSignal').mockReturnValue(entitiesMock)

		const panelsStore = injectPanelsStore()

		// expect(panelsStore.allPanels$).toEqual(allPanelsMock)
		// expect(panelsStore.allPanels).toEqual(allPanelsMock)
		// expect(panelsStore.select.getById('1')).toEqual(entitiesMock['1'])
		// expect(panelsStore.select.getByIds(['1', '2'])).toEqual([entitiesMock['1'], entitiesMock['2']])
		expect(panelsStore.select.getByStringId('Panel 1')).toEqual([allPanelsMock[0]])
		expect(storeMock.dispatch).toHaveBeenCalledTimes(0)
	})
})
