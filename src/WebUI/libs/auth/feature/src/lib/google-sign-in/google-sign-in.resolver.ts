import { inject, Injectable } from '@angular/core'
import { Resolve } from '@angular/router'
import { HttpClient } from '@angular/common/http'

@Injectable({
  providedIn: 'root',
})
export class GoogleSignInResolver implements Resolve<object> {
  private http = inject(HttpClient)

  resolve() {
    return this.http.get('/auth-api/login/google')
  }
}
