import { Component } from '@angular/core'
import { RouterOutlet } from '@angular/router'

@Component({
	standalone: true,
	imports: [RouterOutlet],
	selector: 'app-root',
	template: `
		<div class="h-full min-h-full w-full min-w-full bg-slate-100">
			<router-outlet />
		</div>
	`,
	styles: [''],
})
export class AppComponent {
	title = 'solar-engineer'
}
