describe('design-app-feature', () => {
	beforeEach(() => cy.visit('/iframe.html?id=rightclickmenucomponent--primary'))
	it('should render the component', () => {
		cy.get('app-right-click-menu').should('exist')
	})
})
