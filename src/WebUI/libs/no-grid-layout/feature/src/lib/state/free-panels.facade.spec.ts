import { NgModule } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule, Store } from '@ngrx/store';
import { readFirst } from '@nrwl/angular/testing';

import * as FreePanelsActions from './free-panels.actions';
import { FreePanelsEffects } from './free-panels.effects';
import { FreePanelsFacade } from './free-panels.facade';
import { FreePanelsEntity } from './free-panels.models';
import {
  FREE_PANELS_FEATURE_KEY,
  FreePanelsState,
  initialFreePanelsState,
  freePanelsReducer
} from './free-panels.reducer';
import * as FreePanelsSelectors from './free-panels.selectors';

interface TestSchema {
  freePanels: FreePanelsState;
}

describe('FreePanelsFacade', () => {
  let facade: FreePanelsFacade;
  let store: Store<TestSchema>;
  const createFreePanelsEntity = (id: string, name = ''): FreePanelsEntity => ({
    id,
    name: name || `name-${id}`
  });

  describe('used in NgModule', () => {
    beforeEach(() => {
      @NgModule({
        imports: [
          StoreModule.forFeature(FREE_PANELS_FEATURE_KEY, freePanelsReducer),
          EffectsModule.forFeature([FreePanelsEffects])
        ],
        providers: [FreePanelsFacade]
      })
      class CustomFeatureModule {}

      @NgModule({
        imports: [
          StoreModule.forRoot({}),
          EffectsModule.forRoot([]),
          CustomFeatureModule,
        ]
      })
      class RootModule {}
      TestBed.configureTestingModule({ imports: [RootModule] });

      store = TestBed.inject(Store);
      facade = TestBed.inject(FreePanelsFacade);
    });

    /**
     * The initially generated facade::loadAll() returns empty array
     */
    it('loadAll() should return empty list with loaded == true', async () => {
      let list = await readFirst(facade.allFreePanels$);
      let isLoaded = await readFirst(facade.loaded$);

      expect(list.length).toBe(0);
      expect(isLoaded).toBe(false);

      facade.init();

      list = await readFirst(facade.allFreePanels$);
      isLoaded = await readFirst(facade.loaded$);

      expect(list.length).toBe(0);
      expect(isLoaded).toBe(true);
    });

    /**
     * Use `loadFreePanelsSuccess` to manually update list
     */
    it('allFreePanels$ should return the loaded list; and loaded flag == true', async () => {
      let list = await readFirst(facade.allFreePanels$);
      let isLoaded = await readFirst(facade.loaded$);

      expect(list.length).toBe(0);
      expect(isLoaded).toBe(false);

      store.dispatch(FreePanelsActions.loadFreePanelsSuccess({
        freePanels: [
          createFreePanelsEntity('AAA'),
          createFreePanelsEntity('BBB')
        ]})
      );

      list = await readFirst(facade.allFreePanels$);
      isLoaded = await readFirst(facade.loaded$);

      expect(list.length).toBe(2);
      expect(isLoaded).toBe(true);
    });
  });
});
