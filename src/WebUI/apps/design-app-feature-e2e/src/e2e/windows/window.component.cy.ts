describe('design-app-feature', () => {
	beforeEach(() => cy.visit('/iframe.html?id=windowcomponent--primary&args=windowId;'))
	it('should render the component', () => {
		cy.get('app-window[windowId]').should('exist')
	})
})
