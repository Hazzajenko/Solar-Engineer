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
    return this.http.post<AuthorizeResponse>('/auth-api/auth/authorize', {}, { withCredentials: true })
    /*return this.http.post<AuthorizeResponse>('/auth-api/auth/authorize', {},
     { withCredentials: true, observe: 'response', headers: new HttpHeaders().set('Accept', 'application/json') },
     ).pipe(switchMap(response => {
     const status = response.status
     /!*        const responseBlob =
     response instanceof HttpResponse ? response.body :
     (response as any).error instanceof Blob ? (response as any).error : undefined*!/

     const responseBlob = response.body
     const _headers: any = {}
     if (response.headers) {
     for (const key of response.headers.keys()) {
     _headers[key] = response.headers.get(key)
     }
     }
     if (status === 200) {
     return this.blobToText(responseBlob).pipe(switchMap(_responseText => {
     let result200: any = null
     result200 = _responseText === '' ? null : JSON.parse(_responseText, this.jsonParseReviver) as IdentityContractsResponsesAuthorizeResponse
     return of(result200)
     }))
     } else if (status !== 200 && status !== 204) {
     return this.blobToText(responseBlob).pipe(switchMap(_responseText => {
     return throwError(() => new Error('An unexpected server error occurred.'))
     }))
     }
     return throwError(() => new Error('An unexpected server error occurred.'))
     // return of<IdentityContractsResponsesAuthorizeResponse>(null as any)

     }),
     )*/
    // return this.http.post<GetTokenResponse>('/auth-api/authorize', {}, { withCredentials: true })
  }

  /* blobToText(blob: any): Observable<string> {
   return new Observable<string>((observer: any) => {
   if (!blob) {
   observer.next('')
   observer.complete()
   } else {
   const reader = new FileReader()
   reader.onload = event => {
   observer.next((event.target as any).result)
   observer.complete()
   }
   reader.readAsText(blob)
   }
   })
   }*/

  isTokenExpired(token: string) {
    return this.jwtHelperService.isTokenExpired(token)
  }

  decodeToken(token: string) {
    return this.jwtHelperService.decodeToken(token)
  }

  isReturningUser() {
    return this.http.post<AuthorizeResponse>('/auth-api/auth/returning-user', {})
    // return this.http.post<GetTokenResponse>('/auth-api/returning-user', {})
  }

  getCurrentUser(token?: string) {
    return this.http.get<GetUserResponse>('/auth-api/user', {
      headers: token ? this.getAuthorizationHeader(token) : undefined,
    })
  }

  getToken() {
    return this.http.get<GetTokenResponse>('/auth-api/token', { withCredentials: true })
  }

  getAuthorizationHeader(token: string) {
    return new HttpHeaders().set('Authorization', `Bearer ${token}`)
  }
}
