describe('design-app-feature', () => {
	beforeEach(() => cy.visit('/iframe.html?id=statevaluescomponent--primary'))
	it('should render the component', () => {
		cy.get('app-state-values').should('exist')
	})
})
