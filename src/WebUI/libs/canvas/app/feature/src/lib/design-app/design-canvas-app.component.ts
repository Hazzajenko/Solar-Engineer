import {
	DesignCanvasDirective,
	DynamicContextMenuDirective,
	DynamicDialogDirective,
} from '../directives'
import {
	AfterViewInit,
	ChangeDetectionStrategy,
	Component,
	computed,
	ElementRef,
	inject,
	OnInit,
	Renderer2,
	Signal,
	signal,
	ViewChild,
} from '@angular/core'
import { toSignal } from '@angular/core/rxjs-interop'
import { LetDirective } from '@ngrx/component'
import {
	ActionsNotificationComponent,
	ButtonBuilderComponent,
	InputSvgComponent,
	ShowSvgComponent,
	UndoActionNotificationComponent,
} from '@shared/ui'

import { CdkDrag } from '@angular/cdk/drag-drop'
import { CommonModule } from '@angular/common'
import { OverlayNotificationModalComponent } from '@overlays/notifications/feature'
import { SideUiAuthViewComponent, SideUiNavBarComponent } from '@overlays/side-uis/feature'
import {
	MobileBottomToolbarComponent,
	MobileSideActionToolbarComponent,
	OverlayToolBarComponent,
	SelectedStringToolBarComponent,
} from '@overlays/toolbars/feature'
import { DivElementsService, injectAppStateStore } from '@canvas/app/data-access'
import { injectUiStore } from '@overlays/ui-store/data-access'
import { ContextMenuRendererComponent } from '@overlays/context-menus/feature'
import { injectObjectPositioningStore } from '@canvas/object-positioning/data-access'
import { map } from 'rxjs'
import { GraphicsStoreService } from '@canvas/graphics/data-access'
import { selectSignalFromStore } from '@shared/utils'
import { selectSelectedStringId } from '@canvas/selected/data-access'
import { DialogRendererComponent } from '@overlays/dialogs/feature'
import { injectProjectsStore } from '@entities/data-access'
import { injectAuthStore } from '@auth/data-access'
import { LoadingProjectSpinnerComponent } from '../ui/loading-project-spinner/loading-project-spinner.component'
import { DeviceDetectorService } from 'ngx-device-detector'
import { DefaultHoverEffectsDirective } from '@shared/directives'
import { HttpClient } from '@angular/common/http'

@Component({
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [
		CdkDrag,
		CommonModule,
		ShowSvgComponent,
		LetDirective,
		DesignCanvasDirective,
		ButtonBuilderComponent,
		DesignCanvasDirective,
		DynamicDialogDirective,
		DynamicContextMenuDirective,
		ActionsNotificationComponent,
		UndoActionNotificationComponent,
		OverlayNotificationModalComponent,
		SideUiNavBarComponent,
		OverlayToolBarComponent,
		ContextMenuRendererComponent,
		SelectedStringToolBarComponent,
		MobileBottomToolbarComponent,
		DialogRendererComponent,
		SideUiAuthViewComponent,
		LoadingProjectSpinnerComponent,
		MobileSideActionToolbarComponent,
		DefaultHoverEffectsDirective,
		InputSvgComponent,
	],
	selector: 'app-design-canvas-app',
	standalone: true,
	styles: [],
	templateUrl: './design-canvas-app.component.html',
})
export class DesignCanvasAppComponent implements OnInit, AfterViewInit {
	// private _auth = inject(AuthService)
	private _http = inject(HttpClient)
	private _deviceService = inject(DeviceDetectorService)
	private _projectsStore = injectProjectsStore()
	private _authStore = injectAuthStore()
	private _renderer = inject(Renderer2)
	private _divElements = inject(DivElementsService)
	private _appStore = injectAppStateStore()
	private _uiStore = injectUiStore()
	private _graphicsStore = inject(GraphicsStoreService)
	private _objectPositioningStore = injectObjectPositioningStore()
	// auth0User = toSignal(this._auth.user$, { initialValue: null })
	// accessToken = toSignal(this._auth.getAccessTokenSilently(), { initialValue: null })
	/*_loggedInEff = effect(() => {
	 const auth0User = this.auth0User()
	 // auth0User.
	 if (auth0User) {
	 console.log('auth0User', auth0User)
	 const token = this.accessToken()

	 if (token) {
	 console.log('token', token)
	 const authHeader = getAuthorizationHeader(
	 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6Ilc1U1FIcWZwdUlYMUsyQkJvNDZiUCJ9.eyJpc3MiOiJodHRwczovL2Rldi10OGNvMm03NC51cy5hdXRoMC5jb20vIiwic3ViIjoiV3I0aHlmUTF0bmZwcHA4MDE0Ym5XejBnbjYyOVBNVG5AY2xpZW50cyIsImF1ZCI6Imh0dHBzOi8vaWRlbnRpdHkuc29sYXJlbmdpbmVlci5hcHAiLCJpYXQiOjE2ODc0MDI4NTcsImV4cCI6MTY4NzQ4OTI1NywiYXpwIjoiV3I0aHlmUTF0bmZwcHA4MDE0Ym5XejBnbjYyOVBNVG4iLCJndHkiOiJjbGllbnQtY3JlZGVudGlhbHMifQ.gssS3vuX7IJtpfBGbGFgI9imuBqBWkX4o2FzjLv6FgEYBHobBxw4LnQFS7inpRuvaDzfxQ8NnSV4JfawvYG0udlgq1CJ7aGv8wf7vj6JJrz4Or3Sb6QKOJJIKbE0ngFUHep6sgqgLaQQTik2c8l26tHvRwUweTnUjq9zwqDwANhaiYOxOAsUcxa-WNEWvbg_2Pz71H-gUSArQ2V-YwCfm3fGbq5L9KtSXTrLK9iVQYL1slgzd-4J1f8A7wl_9EMMaM8_EiVAa1V5D5q6pscevPS9dPovb76ENj6ZpmmlQsbBq7RILAv-7leFzY799vnjZSosZovXRI0gBuqIHBNQBg',
	 )

	 this._auth.appState$.subscribe((appState) => {
	 console.log('appState', appState)
	 })

	 /!*
	 this._auth.getAccessTokenWithPopup().subscribe((token) => {
	 console.log('token', token)
	 })
	 *!/
	 /!*
	 this._http
	 .get(
	 `https://dev-t8co2m74.us.auth0.com/authorize?
	 response_type=code&
	 client_id=uE6uqQDFUsznlWaTqa2MNj1ObKuGlmNq&
	 redirect_uri=https://solarengineer.net&
	 scope=openid%20profile&
	 state=xyzABC123`,
	 )
	 .subscribe((res) => {
	 console.log('res', res)
	 })*!/

	 this._http
	 .post('https://dev-t8co2m74.us.auth0.com/oauth/token', {
	 // client_id: 'Wr4hyfQ1tnfppp8014bnWz0gn629PMTn',
	 // client_secret: '9ixJNdDSpm9xmUyt_1fIXr6yQRmVRMUn5v7uTsI7ww7hKnE2zNFBsDi411y9YSqx',
	 client_id: 'uE6uqQDFUsznlWaTqa2MNj1ObKuGlmNq',
	 client_secret: 'le-rnpL59fiCWhiNYKLvdI9vAkRHsUFkbnZrFi51PbndtBNAnAF9lbtSz7Q4piS-',
	 audience: 'https://identity.solarengineer.app',
	 grant_type: 'authorization_code',
	 redirect_uri: window.location.origin,
	 code: 'qzqxDq7_7e1YxQTcJKoX5_V2MC5bEQkq88JId_vUdlNWu',
	 })
	 .subscribe((res) => {
	 console.log('res', res)
	 })

	 // const authHeader = getAuthorizationHeader(token)
	 this._http.get('/auth/claims', { headers: authHeader }).subscribe((claims) => {
	 console.log('claims', claims)
	 // this._authStore.actions.login({ ...auth0User, ...claims })
	 })
	 }
	 // this._auth.getAccessTokenSilently()
	 /!*			this._http
	 .post('https://dev-t8co2m74.us.auth0.com/oauth/token', {
	 client_id: 'Wr4hyfQ1tnfppp8014bnWz0gn629PMTn',
	 client_secret: '9ixJNdDSpm9xmUyt_1fIXr6yQRmVRMUn5v7uTsI7ww7hKnE2zNFBsDi411y9YSqx',
	 audience: 'https://identity.solarengineer.app',
	 grant_type: 'client_credentials',
	 })
	 .subscribe((data) => {
	 console.log('data', data)
	 })*!/
	 // curl --request POST \
	 // --url https://dev-t8co2m74.us.auth0.com/oauth/token \
	 // 			--header 'content-type: application/json' \
	 // --data '{"client_id":"Wr4hyfQ1tnfppp8014bnWz0gn629PMTn","client_secret":"9ixJNdDSpm9xmUyt_1fIXr6yQRmVRMUn5v7uTsI7ww7hKnE2zNFBsDi411y9YSqx","audience":"https://identity.solarengineer.app","grant_type":"client_credentials"}'
	 // const authHeaders = getAuthorizationHeader(auth0User.sub)

	 /!*			this._auth.idTokenClaims$.subscribe((idTokenClaims$) => {
	 console.log('idTokenClaims$', idTokenClaims$)
	 })
	 this._auth.getAccessTokenSilently().subscribe((token) => {
	 console.log('token', token)
	 })*!/
	 // this._authStore.actions.login(this.auth0User())
	 }
	 })*/
	user = this._authStore.select.user
	sideUiMobileMenuOpen = this._uiStore.select.sideUiMobileMenuOpen as Signal<boolean>
	sideUiNavBarOpen = this._uiStore.select.sideUiNavOpen as Signal<boolean>
	userProjects = this._projectsStore.select.allProjects
	isProjectReadyToRender = this._projectsStore.select.projectReadyToRender

	showProjectSpinner = computed(() => {
		return !this.isProjectReadyToRender() && !!this.user() && this.userProjects().length > 0
	})

	version = signal('1.0.7')
	showFpsState = toSignal(this._graphicsStore.state$.pipe(map((state) => state.showFps)), {
		initialValue: this._graphicsStore.state.showFps,
	})
	stringIsSelected = selectSignalFromStore(selectSelectedStringId)
	@ViewChild('appStats', { static: true }) appStats!: ElementRef<HTMLDivElement>
	cursorState = computed(() => {
		const { moveEntityState, toMoveSpotTaken, rotateEntityState } =
			this._objectPositioningStore.select.cursorState()
		if (moveEntityState === 'MovingSingleEntity' || moveEntityState === 'MovingMultipleEntities') {
			if (toMoveSpotTaken) {
				return 'not-allowed'
			}
			return 'grabbing'
		}

		if (
			rotateEntityState === 'RotatingSingleEntity' ||
			rotateEntityState === 'RotatingMultipleEntities'
		) {
			return 'ns-resize'
		}

		const viewPositioningState = this._appStore.select.view()

		if (viewPositioningState === 'ViewDraggingInProgress') {
			return 'move'
		}

		return ''
	})

	constructor() {
		this.waitForElements()
	}

	ngOnInit() {
		console.log(this.constructor.name, 'ngOnInit')
		const deviceInfo = this._deviceService.getDeviceInfo()

		console.log(deviceInfo)

		console.log(window.location.origin)
		console.log(window.location.pathname)

		// this._auth.loginWithRedirect()
		/*		this._auth.loginWithRedirect({
		 appState: {
		 target: window.location.pathname,
		 },
		 })*/
		// this._auth.loginWithPopup()
	}

	ngAfterViewInit() {
		if (this.appStats) {
			const children = this.appStats.nativeElement.children
			for (let i = 0; i < children.length; i++) {
				this._divElements.addElement(children[i] as HTMLDivElement)
			}
		}
	}

	waitForElements() {
		this._renderer.listen(document, 'DOMContentLoaded', () => {
			this._divElements.initElements()
		})
	}

	toggleSideUiNav() {
		this._uiStore.dispatch.toggleSideUiNav()
	}
}
