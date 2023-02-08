export interface AuthConfig {
  clientID: string
  domain: string
  callbackURL: string
  silentCallbackURL: string
  audience: string
  apiUrl: string
}

export const AUTH_CONFIG: AuthConfig = {
  clientID: 'uE6uqQDFUsznlWaTqa2MNj1ObKuGlmNq',
  domain: 'dev-t8co2m74.us.auth0.com',
  callbackURL: 'http://localhost:4200',
  silentCallbackURL: 'http://localhost:3001/silent',
  audience: 'https://solarengineer.dev',
  apiUrl: 'http://localhost:5000',
}
// domain: 'dev-t8co2m74.us.auth0.com',
// clientId: 'uE6uqQDFUsznlWaTqa2MNj1ObKuGlmNq',
