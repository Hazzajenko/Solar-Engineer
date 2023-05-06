describe('design-app-feature', () => {
	beforeEach(() => cy.visit('/iframe.html?id=keymapcomponent--primary'))
	it('should render the component', () => {
		cy.get('app-key-map-component').should('exist')
	})
})
