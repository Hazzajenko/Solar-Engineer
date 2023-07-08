import { provideStoreDevtools } from '@ngrx/store-devtools'

export const storeDevtoolsModule = [
	provideStoreDevtools({
		maxAge: 25,
	}),
]
