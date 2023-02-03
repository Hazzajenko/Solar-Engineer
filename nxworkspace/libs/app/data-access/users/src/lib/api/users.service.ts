import { HttpClient, HttpResponse } from '@angular/common/http'
import { inject, Injectable } from '@angular/core'
import { GetUserResponse } from '../models/get-user.response'
import { map } from 'rxjs'
import { UpdateDisplayPictureRequest } from '../models'

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  private http = inject(HttpClient)

  getUserByUserName(userName: string) {
    return this.http.get<GetUserResponse>(`/api/user/${userName}`)
    // .pipe(map((response) => response.user))
  }

  updateDisplayPicture(request: UpdateDisplayPictureRequest) {
    return this.http.put(`/api/users/${request.userName}/dp`, {
      ...request,
    })
  }
}