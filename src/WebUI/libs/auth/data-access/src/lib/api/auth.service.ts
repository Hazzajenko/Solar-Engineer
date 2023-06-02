import { HttpClient, HttpHeaders } from '@angular/common/http'
import { inject, Injectable } from '@angular/core'
import { GetTokenResponse } from '../contracts/get-token.response'
import { GetUserResponse } from '../contracts/get-user.response'
import { JwtHelperService } from '@auth0/angular-jwt'
import { AuthorizeResponse } from '../contracts'

@Injectable({
	providedIn: 'root',
})
export class AuthService {
	private http = inject(HttpClient)
	private jwtHelperService = inject(JwtHelperService)

	// protected jsonParseReviver: ((key: string, value: any) => any) | undefined = undefined

	authorizeRequest() {
		return this.http.post<AuthorizeResponse>('/auth/authorize', {}, { withCredentials: true })
	}

	signInWithGoogle() {
		return this.http.post<AuthorizeResponse>('/auth/google', {}, { withCredentials: true })
	}

	isTokenExpired(token: string) {
		return this.jwtHelperService.isTokenExpired(token)
	}

	decodeToken(token: string) {
		return this.jwtHelperService.decodeToken(token)
	}

	isReturningUser() {
		return this.http.post<AuthorizeResponse>('/auth/returning-user', {})
		// return this.http.post<GetTokenResponse>('/auth/returning-user', {})
	}

	getCurrentUser(token?: string) {
		return this.http.get<GetUserResponse>('/auth/user', {
			headers: token ? this.getAuthorizationHeader(token) : undefined,
		})
	}

	getToken() {
		return this.http.get<GetTokenResponse>('/auth/token', { withCredentials: true })
	}

	getAuthorizationHeader(token: string) {
		return new HttpHeaders().set('Authorization', `Bearer ${token}`)
	}
}
