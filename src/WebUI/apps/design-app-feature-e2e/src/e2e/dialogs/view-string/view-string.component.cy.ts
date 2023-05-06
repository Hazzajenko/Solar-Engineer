describe('design-app-feature', () => {
	beforeEach(() => cy.visit('/iframe.html?id=viewstringcomponent--primary'))
	it('should render the component', () => {
		cy.get('app-view-string-component').should('exist')
	})
})
