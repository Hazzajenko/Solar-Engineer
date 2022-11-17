import { NgModule } from '@angular/core'
import { BrowserModule } from '@angular/platform-browser'

import { AppRoutingModule } from './app-routing.module'
import { AppComponent } from './app.component'
import { ProjectsComponent } from './projects/projects.component'
import { ProjectListItemComponent } from './projects/project-list-item/project-list-item.component'
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http'
import { ProjectIdComponent } from './projects/project-id/project-id.component'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { MatListModule } from '@angular/material/list'
import { StoreModule } from '@ngrx/store'
import { RouterState, StoreRouterConnectingModule } from '@ngrx/router-store'
import { StoreDevtoolsModule } from '@ngrx/store-devtools'
import { environment } from '../environments/environment'
import { metaReducers, reducers } from './store/app.state'
import { LoginComponent } from './auth/login/login.component'
import { MatCardModule } from '@angular/material/card'
import { MatFormFieldModule } from '@angular/material/form-field'
import { ReactiveFormsModule } from '@angular/forms'
import { MatInputModule } from '@angular/material/input'
import { MatButtonModule } from '@angular/material/button'
import { JwtModule } from '@auth0/angular-jwt'
import { MatTreeModule } from '@angular/material/tree'
import { MatIconModule } from '@angular/material/icon'
import { MatCheckboxModule } from '@angular/material/checkbox'
import { MatMenuModule } from '@angular/material/menu'
import { MatGridListModule } from '@angular/material/grid-list'
import { ProjectTreeComponent } from './projects/project-id/components/project-tree/project-tree.component'
import { MatSortModule } from '@angular/material/sort'
import { JwtInterceptor } from './interceptors/jwt.interceptor'
import { InverterViewComponent } from './projects/project-id/views/inverter-view/inverter-view.component'
import { DragDropModule } from '@angular/cdk/drag-drop'
import { GridLayoutComponent } from './projects/project-id/views/grid-layout/grid-layout.component'
import { ProjectViewComponent } from './projects/project-id/views/project-view/project-view.component'
import { TrackerViewComponent } from './projects/project-id/views/tracker-view/tracker-view.component'
import { StringViewComponent } from './projects/project-id/views/string-view/string-view.component'
import { ButtonMenuComponent } from './projects/project-id/components/project-tree/button-menu/button-menu.component'
import { FilterStringsPipe } from './pipes/filter-strings.pipe'
import { FilterPanelsPipe } from './pipes/filter-panels.pipe'
import { GridInventoryComponent } from './projects/project-id/views/grid-inventory/grid-inventory.component'
import { TrackerTreeComponent } from './projects/project-id/views/tracker-tree/tracker-tree.component'
import { StringStatsComponent } from './projects/project-id/components/string-stats/string-stats.component'
import { MatTooltipModule } from '@angular/material/tooltip'
import { TrackerStatsComponent } from './projects/project-id/components/tracker-stats/tracker-stats.component'
import { FilterTrackersPipe } from './pipes/filter-trackers.pipe'
import { StatsSectionComponent } from './projects/project-id/components/project-tree/stats-section/stats-section.component'
import { FilterPanelsByPipe } from './pipes/filter-panels-by.pipe'
import { FilterStringsByPipe } from './pipes/filter-strings-by.pipe'
import { MatToolbarModule } from '@angular/material/toolbar'
import { GridToolbarComponent } from './projects/project-id/views/grid-layout/grid-toolbar/grid-toolbar.component'
import { FilterBlocksByPipe } from './pipes/filter-blocks-by.pipe'
import { FindBlockPipe } from './pipes/find-block.pipe'
import { FindPanelPipe } from './pipes/find-panel.pipe'
import { EffectsModule } from '@ngrx/effects'
import { FindCablePipe } from './pipes/find-cable.pipe'
import { CablesEffects } from './projects/store/cable/cables.effects'
import { PanelsEffects } from './projects/store/panels/panels.effects'

export function tokenGetter() {
  // console.log(localStorage.getItem('token'))
  return localStorage.getItem('token')
}

@NgModule({
  declarations: [
    AppComponent,
    ProjectsComponent,
    ProjectListItemComponent,
    ProjectIdComponent,
    LoginComponent,
    ProjectTreeComponent,
    InverterViewComponent,
    GridLayoutComponent,
    ProjectViewComponent,
    TrackerViewComponent,
    StringViewComponent,
    ButtonMenuComponent,
    FilterStringsPipe,
    FilterPanelsPipe,
    GridInventoryComponent,
    TrackerTreeComponent,
    StringStatsComponent,
    TrackerStatsComponent,
    FilterTrackersPipe,
    StatsSectionComponent,
    FilterPanelsByPipe,
    GridToolbarComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatListModule,
    JwtModule.forRoot({
      config: {
        tokenGetter: tokenGetter,
        allowedDomains: ['http://localhost:3000'],
        // disallowedRoutes: ["http://example.com/examplebadroute/"],
      },
    }),
    StoreModule.forRoot(reducers, { metaReducers }),
    StoreDevtoolsModule.instrument({
      maxAge: 25,
      logOnly: environment.production,
    }),
    StoreRouterConnectingModule.forRoot({
      stateKey: 'router',
      routerState: RouterState.Minimal,
    }),
    StoreDevtoolsModule.instrument({
      maxAge: 25,
      logOnly: environment.production,
    }),
    MatCardModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatInputModule,
    MatButtonModule,
    MatTreeModule,
    MatIconModule,
    MatCheckboxModule,
    MatMenuModule,
    MatGridListModule,
    MatSortModule,
    DragDropModule,
    MatTooltipModule,
    FilterStringsByPipe,
    MatToolbarModule,
    FilterBlocksByPipe,
    FindBlockPipe,
    FindPanelPipe,
    EffectsModule.forRoot([CablesEffects, PanelsEffects]),
    FindCablePipe,
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: JwtInterceptor,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
