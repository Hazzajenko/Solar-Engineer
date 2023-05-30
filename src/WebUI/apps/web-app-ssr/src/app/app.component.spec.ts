import { TestBed } from '@angular/core/testing'
import { AppComponent } from './app.component'

describe('AppComponent', () => {
	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [AppComponent],
		}).compileComponents()
	})

	it('should render title', () => {
		const fixture = TestBed.createComponent(AppComponent)
		fixture.detectChanges()
		const compiled = fixture.nativeElement as HTMLElement
		expect(compiled.querySelector('h1')?.textContent).toContain('Welcome web-app-ssr')
	})
})
