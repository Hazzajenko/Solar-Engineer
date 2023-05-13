import { provideStoreDevtools, StoreDevtoolsModule } from '@ngrx/store-devtools'

export const storeDevtoolsModule = [
  provideStoreDevtools({
    maxAge: 25,
    // logOnly: false,
  }),
  // StoreDevtoolsModule.instrument({
  //   maxAge: 25,
  // }),
]