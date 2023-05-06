describe('design-app-feature', () => {
	beforeEach(() => cy.visit('/iframe.html?id=canvasgraphicsmenucomponent--primary'))
	it('should render the component', () => {
		cy.get('app-canvas-graphics-menu').should('exist')
	})
})
