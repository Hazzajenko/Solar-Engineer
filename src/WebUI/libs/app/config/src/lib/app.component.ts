import { Component, inject } from '@angular/core'
import { RouterOutlet } from '@angular/router'
import { checkAuthFlow } from './check-auth-flow'
import { ApplicationInsightsService } from '../../../logging/src/lib/application-insights.service'
import { WINDOW } from '@sentry/angular-ivy'

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
	private _insights = inject(ApplicationInsightsService)
	title = 'solar-engineer'
	checkAuthFlow = checkAuthFlow()

	constructor() {
		this._insights.logMetric('App Loaded', 1)
		this._insights.logPageView('App Component', WINDOW.location.href)
	}
}
