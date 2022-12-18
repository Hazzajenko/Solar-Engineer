import { createEnvironmentInjector, enableProdMode, importProvidersFrom } from '@angular/core'
import { bootstrapApplication, BrowserModule } from '@angular/platform-browser'
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic'

import { AppModule, tokenGetter } from './app/app.module'
import { environment } from './environments/environment'
import { ProjectGridPage } from './app/pages/project-grid/project-grid.page'
import { AppComponent } from './app/app.component'
import { RouterModule } from '@angular/router'
import { routes } from './app/routes'
import { metaReducers, reducers } from '@shared/data-access/store'
import { provideStoreDevtools, StoreDevtoolsModule } from '@ngrx/store-devtools'
import { provideRouterStore, RouterState, StoreRouterConnectingModule } from '@ngrx/router-store'
import { provideStore, StoreModule } from '@ngrx/store'
import { provideEffects } from '@ngrx/effects'
import { HTTP_INTERCEPTORS, HttpClientJsonpModule, HttpClientModule } from '@angular/common/http'
import { JwtModule } from '@auth0/angular-jwt'
import {
  DisconnectionPointsDataService,
  DisconnectionPointsEntityService, DisconnectionPointsResolver, entityConfig, entityMetadata,
  PanelLinksDataService,
  PanelLinksEntityService, PanelLinksResolver,
  PanelsDataService,
  PanelsEntityService,
  PanelsResolver, StringsDataService,
  StringsEntityService, StringsResolver, TraysDataService, TraysEntityService, TraysResolver,
} from '@grid-layout/data-access/store'
import {
  DefaultDataServiceConfig,
  DefaultDataServiceFactory,
  EntityDataService,
  EntityDefinitionService,
  HttpUrlGenerator, Pluralizer,
  provideEntityData,
} from '@ngrx/data'
import { CustomHttpUrlGenerator } from './app/http-url-generator'
import { MatDialog, MatDialogModule } from '@angular/material/dialog'
import { CustomPlural } from './app/plural'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { JwtInterceptor } from '@auth/interceptors'
import { CurrentProjectInterceptor } from '@shared/interceptors'

if (environment.production) {
  enableProdMode()
}

/*platformBrowserDynamic()
  .bootstrapModule(AppModule)
  .catch((err) => console.error(err))*/

export const defaultDataServiceConfig: DefaultDataServiceConfig = {
  root: 'http://localhost:3000',
  // root: environment.apiUrl,
  // timeout: 3000, // request timeout
}


bootstrapApplication(AppComponent, {
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: JwtInterceptor,
      multi: true,
    },
/*    {
      provide: HTTP_INTERCEPTORS,
      useClass: CurrentProjectInterceptor,
      multi: true,
    },*/
    { provide: DefaultDataServiceConfig, useValue: defaultDataServiceConfig },
/*    { provide: DefaultDataServiceConfig, useValue: defaultDataServiceConfig },
    { provide: HttpUrlGenerator, useClass: CustomHttpUrlGenerator },*/
    { provide: HttpUrlGenerator, useClass: CustomHttpUrlGenerator },
    // createEnvironmentInjector([{ provide: HttpUrlGenerator, useClass: CustomHttpUrlGenerator }], Pluralizer),
    { provide: Pluralizer, useClass: CustomPlural},
    importProvidersFrom(
      BrowserModule,
      BrowserAnimationsModule,
      HttpClientJsonpModule,
      HttpClientModule,
      JwtModule.forRoot({
        config: {
          tokenGetter: tokenGetter,
          allowedDomains: ['http://localhost:3000'],
          // disallowedRoutes: ["http://example.com/examplebadroute/"],
        },
      }),
      RouterModule.forRoot(routes),
      PanelsEntityService,
      PanelsResolver,
      PanelsDataService,
      StringsEntityService,
      StringsResolver,
      StringsDataService,
      PanelLinksEntityService,
      PanelLinksResolver,
      PanelLinksDataService,
      DisconnectionPointsEntityService,
      DisconnectionPointsResolver,
      DisconnectionPointsDataService,
      TraysEntityService,
      TraysResolver,
      TraysDataService,
      EntityDefinitionService,
      EntityDataService,
DefaultDataServiceFactory,
      MatDialogModule

/*      StoreModule.forRoot(reducers, { metaReducers }),
      StoreDevtoolsModule.instrument({
        maxAge: 25,
        logOnly: environment.production,
      }),
      StoreRouterConnectingModule.forRoot({
        stateKey: 'router',
        routerState: RouterState.Minimal,
      }),*/
    ),
    provideStore(reducers, { metaReducers }),
    // alternative to `StoreRouterConnectingModule.forRoot`
    provideRouterStore(),
    // alternative to `StoreDevtoolsModule.instrument`
    provideStoreDevtools({
      maxAge: 25,
      logOnly: environment.production,
    }),
    provideEntityData(entityConfig)

    // alternative to `EffectsModule.forRoot`
    // provideEffects([RouterEffects, AuthEffects]),

  ],
}).catch(err => console.error(err))
// bootstrapApplication(ProjectGridPage).catch(err => console.error(err))
