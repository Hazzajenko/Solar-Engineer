import { FreePanelsEffects } from './state/free-panels.effects'
import { FreePanelsFacade } from './state/free-panels.facade'
import * as fromFreePanels from './state/free-panels.reducer'
import { Route } from '@angular/router'
import { provideEffects } from '@ngrx/effects'
import { provideState } from '@ngrx/store'
import { NoGridLayoutComponent } from '@no-grid-layout/feature'


export const noGridLayoutRoutes: Route[] = [
  {
    path: '',
    component: NoGridLayoutComponent,
    providers: [
      FreePanelsFacade,
      provideState(fromFreePanels.FREE_PANELS_FEATURE_KEY, fromFreePanels.freePanelsReducer),
      provideEffects(FreePanelsEffects),
    ],
  },
]