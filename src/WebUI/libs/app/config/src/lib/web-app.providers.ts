/*
 export const webAppProviders = [
 provideZoneChangeDetection({ eventCoalescing: true }),
 provideRouter(appRoutes, withEnabledBlockingInitialNavigation() /!*, withDebugTracing()*!/),
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
 provideStore(reducers, { metaReducers }),
 provideRouterStore(),
 ...DesignAppNgrxStores,
 ...storeDevtoolsModule,
 jwtInterceptorProvider,
 ]

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
 }*/
