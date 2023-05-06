describe('design-app-feature', () => {
	beforeEach(() => cy.visit('/iframe.html?id=movepanelstostringcomponent--primary'))
	it('should render the component', () => {
		cy.get('dialog-move-panels-to-string').should('exist')
	})
})
