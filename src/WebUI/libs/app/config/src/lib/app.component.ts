import { Component } from '@angular/core'
import { RouterOutlet } from '@angular/router'
import { checkAuthFlow } from './check-auth-flow'

@Component({
	standalone: true,
	imports: [RouterOutlet],
	selector: 'app-root',
	template: `
		<html class="h-full">
			<body class="h-full">
				<div class="h-full min-h-full w-full min-w-full bg-slate-100">
					<router-outlet />
				</div>
			</body>
		</html>
	`,
	styles: [''],
})
export class AppComponent {
	title = 'solar-engineer'
	checkAuthFlow = checkAuthFlow()
}
