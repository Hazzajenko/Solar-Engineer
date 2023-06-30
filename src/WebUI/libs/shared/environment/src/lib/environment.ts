import { firebaseConfig } from './firebase'
import { auth0Config } from './auth0'
import { AZURE_STORAGE_URL } from './azure-storage'

const apiUri = 'https://solarengineer.net'
export const environment = {
	production: false,
	firebaseConfig,
	auth0Config,
	AZURE_STORAGE_URL,
	httpInterceptor: {
		allowedList: [`${apiUri}/*`],
	},
}
