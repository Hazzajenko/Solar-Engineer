import { initMainTs } from '@app/config'

initMainTs()

/*

 if (environment.production) {
 // eslint-disable-next-line @typescript-eslint/no-empty-function
 window.console.log = () => {}
 // eslint-disable-next-line @typescript-eslint/no-empty-function
 window.console.debug = () => {}
 // eslint-disable-next-line @typescript-eslint/no-empty-function
 window.console.info = () => {}
 // eslint-disable-next-line @typescript-eslint/no-empty-function
 window.console.warn = () => {}
 // eslint-disable-next-line @typescript-eslint/no-empty-function
 window.console.error = () => {}
 }

 bootstrapApplication(AppComponent, {
 providers: [provideWebAppProviders()],
 }).catch((err) => console.error(err))

 export function provideWebAppProviders() {
 return makeEnvironmentProviders([
 provideZoneChangeDetection({ eventCoalescing: true }),
 provideRouter(appRoutes, withEnabledBlockingInitialNavigation() /!*, withDebugTracing()*!/),
 provideCanvasAppStores(),
 provideStore(reducers, { metaReducers }),
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
 DatePipe /!*			JwtModule.forRoot({
 config: {
 tokenGetter: tokenGetter,
 },
 }),*!/,
 ),
 ...storeDevtoolsModule,
 // jwtInterceptorProvider,
 ])
 }

 export function provideCanvasAppStores() {
 return makeEnvironmentProviders([
 provideSelectedFeature(),
 provideEntityStores(),
 // providePanelsFeature(),
 // provideStringsFeature(),
 // providePanelConfigsFeature(),
 // providePanelLinksFeature(),
 // provideState(APP_STATE_FEATURE_KEY, appStateReducer),
 provideAppStateFeature(),
 provideState(UI_FEATURE_KEY, uiReducer),
 // provideState(SELECTED_FEATURE_KEY, selectedReducer),
 provideState(OBJECT_POSITIONING_FEATURE_KEY, objectPositioningReducer),
 provideState(GRAPHICS_FEATURE_KEY, graphicsReducer),
 provideState(WINDOWS_FEATURE_KEY, windowsReducer),
 provideState(KEYS_FEATURE_KEY, keysReducer),
 provideNotificationsFeature(),
 // provideState(NOTIFICATIONS_FEATURE_KEY, notificationsReducer),
 // provideEffects({ renderCanvasOnStateChanges$ }),
 provideRenderingEffects(),
 ])
 }
 */
