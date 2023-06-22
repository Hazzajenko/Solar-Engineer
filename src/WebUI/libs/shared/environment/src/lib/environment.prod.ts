import { firebaseConfig } from './firebase'
import { auth0Config } from './auth0'

const apiUri = 'https://solarengineer.app'
export const environment = {
	production: true,
	firebaseConfig,
	auth0Config,
	httpInterceptor: {
		allowedList: [`${apiUri}/*`],
	},
}
