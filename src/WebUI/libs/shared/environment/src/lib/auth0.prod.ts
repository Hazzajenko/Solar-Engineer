type Auth0Config = {
	domain: string
	clientId: string
	authorizationParams: {
		audience?: string
		redirect_uri: string
	}
	apiUri: string
	errorPath: string
}

export const auth0Config: Auth0Config = {
	domain: 'dev-t8co2m74.us.auth0.com',
	clientId: 'uE6uqQDFUsznlWaTqa2MNj1ObKuGlmNq',
	authorizationParams: {
		redirect_uri: 'https://solarengineer.app',
	},
	apiUri: 'https://solarengineer.app',
	errorPath: '/error',
}
