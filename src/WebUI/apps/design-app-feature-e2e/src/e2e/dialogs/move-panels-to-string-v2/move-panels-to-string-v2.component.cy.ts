describe('design-app-feature', () => {
	beforeEach(() => cy.visit('/iframe.html?id=movepanelstostringv2component--primary'))
	it('should render the component', () => {
		cy.get('dialog-move-panels-to-string-v2').should('exist')
	})
})
