import { firebaseConfig } from './firebase'
import { auth0Config } from './auth0'

const apiUri = 'https://solarengineer.net'
export const environment = {
	production: false,
	firebaseConfig,
	auth0Config,
	httpInterceptor: {
		allowedList: [`${apiUri}/*`],
	},
}
