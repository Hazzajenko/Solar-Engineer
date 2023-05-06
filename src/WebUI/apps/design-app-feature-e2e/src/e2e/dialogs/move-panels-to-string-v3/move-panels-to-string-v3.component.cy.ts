describe('design-app-feature', () => {
	beforeEach(() => cy.visit('/iframe.html?id=movepanelstostringv3component--primary'))
	it('should render the component', () => {
		cy.get('dialog-move-panels-to-string-v3').should('exist')
	})
})
