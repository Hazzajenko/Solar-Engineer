import { CommonModule } from '@angular/common'
import { Component, inject, OnInit } from '@angular/core'
import { BaseService } from '@shared/logger'
import { ActivatedRoute, RouterOutlet } from '@angular/router'
import { FooterComponent } from '@shared/ui/footer'
import { RouterFacade } from '@shared/data-access/router'

@Component({
	standalone: true,
	imports: [CommonModule, RouterOutlet, FooterComponent],
	selector: 'app-root',
	templateUrl: './app.component.html',
	styles: [],
})
export class AppComponent extends BaseService implements OnInit {
	private routerFacade = inject(RouterFacade)
	private activatedRoute = inject(ActivatedRoute)

	route$ = this.routerFacade.currentRoute$
	url$ = this.routerFacade.selectUrl$

	ngOnInit(): void {
		this.logDebug('AppComponent.ngOnInit()')
		this.route$.subscribe((route) => {
			this.logDebug('AppComponent.route$', route)
		})
		this.url$.subscribe((url) => {
			this.logDebug('AppComponent.url$', url)
		})
		// }
		this.activatedRoute.url.subscribe((url) => {
			this.logDebug('AppComponent.activatedRoute.url', url)
		})
		const path = this.activatedRoute.routeConfig?.path
		this.logDebug('AppComponent.activatedRoute.routeConfig?.path', path)
	}
}
