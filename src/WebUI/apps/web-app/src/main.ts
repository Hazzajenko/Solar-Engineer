import { bootstrapApplication } from '@angular/platform-browser'
import { AppComponent } from './app/app.component'
import { provideWebAppProviders } from '@app/config'

bootstrapApplication(AppComponent, {
	providers: [provideWebAppProviders()],
}).catch((err) => console.error(err))

/*
 export function provideWebAppProviders() {
 return makeEnvironmentProviders([
 provideZoneChangeDetection({ eventCoalescing: true }),
 provideRouter(appRoutes, withEnabledBlockingInitialNavigation() /!*, withDebugTracing()*!/),
 provideStore(reducers, { metaReducers }),
 provideCanvasAppStores(),
 provideRouterStore(),
 provideAnimations(),
 provideNoopAnimations(),
 provideHttpClient(),
 provideToastr(),
 importProvidersFrom(
 BrowserAnimationsModule,
 BrowserModule,
 MatDialogModule,
 MatSnackBarModule,
 MatSnackBarRef,
 DatePipe,
 JwtModule.forRoot({
 config: {
 tokenGetter: tokenGetter,
 },
 }),
 ),
 ...storeDevtoolsModule,
 jwtInterceptorProvider,
 ])
 }
 */

/*
 export function provideCanvasAppStores() {
 return makeEnvironmentProviders([
 providePanelsFeature(),
 provideStringsFeature(),
 providePanelConfigsFeature(),
 providePanelLinksFeature(),
 provideState(APP_STATE_FEATURE_KEY, appStateReducer),
 provideState(UI_FEATURE_KEY, uiReducer),
 provideState(SELECTED_FEATURE_KEY, selectedReducer),
 provideState(OBJECT_POSITIONING_FEATURE_KEY, objectPositioningReducer),
 provideState(GRAPHICS_FEATURE_KEY, graphicsReducer),
 provideState(WINDOWS_FEATURE_KEY, windowsReducer),
 provideState(KEYS_FEATURE_KEY, keysReducer),
 provideState(NOTIFICATIONS_FEATURE_KEY, notificationsReducer),
 provideEffects(globalEffects),
 ])
 }
 */
