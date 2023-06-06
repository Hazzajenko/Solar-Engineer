import { importProvidersFrom, makeEnvironmentProviders } from '@angular/core'
import { initializeApp, provideFirebaseApp } from '@angular/fire/app'
import { environment } from '@shared/environment'
import { getFirestore, provideFirestore } from '@angular/fire/firestore'

export function provideFirebase() {
	return makeEnvironmentProviders([
		importProvidersFrom(
			provideFirebaseApp(() => initializeApp(environment.firebaseConfig)),
			provideFirestore(() => getFirestore()), // provideFirestore(() => getFirestore()),
			// getAuth(initializeApp(environment.firebaseConfig)),
		),
		importProvidersFrom(), // provideFirebaseApp(() => initializeApp(environment.firebaseConfig)),
		// provideFirestore(() => getFirestore()), // provideAuth(),

		/*		provideAuth(),
		 provideFirestore(),
		 provideFunctions(),
		 provideStorage(),
		 provideAnalytics(),
		 providePerformance(),*/
	])
}
