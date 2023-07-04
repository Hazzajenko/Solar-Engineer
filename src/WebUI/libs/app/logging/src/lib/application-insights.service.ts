import { inject, Injectable } from '@angular/core'
import { ActivatedRouteSnapshot, ResolveEnd, Router } from '@angular/router'
import {
	ApplicationInsights,
	IPageViewTelemetry,
	ITelemetryItem,
} from '@microsoft/applicationinsights-web'
import { environment } from '@shared/environment'
import { filter } from 'rxjs'

@Injectable({ providedIn: 'root' })
export class ApplicationInsightsService {
	private _router = inject(Router)

	private _appInsights = new ApplicationInsights({
		config: {
			instrumentationKey: environment.appInsights.instrumentationKey,
			loggingLevelConsole: 2,
			enableCorsCorrelation: true,
			enableRequestHeaderTracking: true,
			enableResponseHeaderTracking: true,
			enableAutoRouteTracking: true,
		},
	})

	constructor() {
		this._appInsights.loadAppInsights()
		this._appInsights.addTelemetryInitializer((envelope: ITelemetryItem) => {
			envelope.tags = envelope.tags || []
		})

		this._router.events
			.pipe(filter((event: unknown): event is ResolveEnd => event instanceof ResolveEnd))
			.subscribe((event: ResolveEnd) => {
				const activatedComponent = this.getActivatedComponent(event.state.root)
				if (activatedComponent)
					this._appInsights.trackPageView({
						name: activatedComponent.name,
						uri: event.urlAfterRedirects,
					})
			})
	}

	setAuthenticatedUserContext(userId: string) {
		this._appInsights.setAuthenticatedUserContext(userId)
	}

	clearAuthenticatedUserContext() {
		this._appInsights.clearAuthenticatedUserContext()
	}

	logPageView(name?: string, url?: string) {
		this._appInsights.trackPageView({
			name: name,
			uri: url,
		})
	}

	logEvent(
		name: string,
		properties?: {
			[key: string]: any
		},
	) {
		this._appInsights.trackEvent({ name: name }, properties)
	}

	logMetric(
		name: string,
		average: number,
		properties?: {
			[key: string]: any
		},
	) {
		this._appInsights.trackMetric({ name: name, average: average }, properties)
	}

	logException(exception: Error, severityLevel?: number) {
		this._appInsights.trackException({ exception: exception, severityLevel: severityLevel })
	}

	logTrace(
		message: string,
		properties?: {
			[key: string]: any
		},
	) {
		this._appInsights.trackTrace({ message: message }, properties)
	}

	private getActivatedComponent(snapshot: ActivatedRouteSnapshot): IPageViewTelemetry | null {
		if (snapshot.firstChild) {
			return this.getActivatedComponent(snapshot.firstChild)
		}
		return snapshot.component
	}
}

/*// eslint-disable-next-line @typescript-eslint/ban-ts-comment
 // @ts-ignore
 extensions: [this.angularPlugin],
 extensionConfig: {
 [this.angularPlugin.identifier]: {
 router: this._router,
 errorServices: [new ErrorHandler()],
 },
 },*/
