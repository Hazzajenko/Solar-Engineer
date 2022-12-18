import { NgModule } from '@angular/core'
import { BrowserModule } from '@angular/platform-browser'
import { AppRoutingModule } from './app-routing.module'
import { AppComponent } from './app.component'
import { HTTP_INTERCEPTORS, HttpClientJsonpModule, HttpClientModule } from '@angular/common/http'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { StoreModule } from '@ngrx/store'
import { RouterState, StoreRouterConnectingModule } from '@ngrx/router-store'
import { StoreDevtoolsModule } from '@ngrx/store-devtools'
import { environment } from '../environments/environment'
import { JwtInterceptor } from '@auth/interceptors'
import { metaReducers, reducers } from '@shared/data-access/store'
import { JwtModule } from '@auth0/angular-jwt'
import { GridLayoutModule } from '@grid-layout/shell'
import { projectsReducer } from '@grid-layout/data-access/store'

/*const rootReducers = {
  ['projects']: projectsReducer
  // [playlistTrackFeatureKey]: playlistTracksReducer
};*/
export function tokenGetter() {
  // console.log(localStorage.getItem('token'))
  return localStorage.getItem('token')
}
@NgModule({
  declarations: [],
  imports: [
    JwtModule.forRoot({
      config: {
        tokenGetter: tokenGetter,
        allowedDomains: ['http://localhost:3000'],
        // disallowedRoutes: ["http://example.com/examplebadroute/"],
      },
    }),
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    HttpClientJsonpModule,
    BrowserAnimationsModule,
    // StoreModule.forFeature('app', reducers, { metaReducers }),
    // StoreModule.forFeature('app', reducers, { metaReducers }),
    // StoreModule.forRoot(rootReducers),
    StoreModule.forRoot(reducers, { metaReducers }),
    StoreDevtoolsModule.instrument({
      maxAge: 25,
      logOnly: environment.production,
    }),
    StoreRouterConnectingModule.forRoot({
      stateKey: 'router',
      routerState: RouterState.Minimal,
    }),
    // GridLayoutModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: JwtInterceptor,
      multi: true,
    },
  ],
  bootstrap: [],
})
export class AppModule {
}
