describe('design-app-feature', () => {
	beforeEach(() => cy.visit('/iframe.html?id=designcanvasappcomponent--primary'))
	it('should render the component', () => {
		cy.get('app-design-canvas-app').should('exist')
	})
})
