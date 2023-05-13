import { Component } from '@angular/core'
import { NxWelcomeComponent } from './nx-welcome.component'

@Component({
	standalone: true,
	imports: [NxWelcomeComponent],
	selector: 'app-root',
	template: `<app-nx-welcome></app-nx-welcome> `,
	styles: [''],
})
export class AppComponent {
	title = 'web-app'
}
