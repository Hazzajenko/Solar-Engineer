import { HttpClient, HttpResponse } from '@angular/common/http'
import { inject, Injectable } from '@angular/core'
import { GetUserResponse } from '../models/get-user.response'
import { map } from 'rxjs'
import { UpdateDisplayPictureRequest } from '../models'
import { GetUserLinkResponse } from '../models/get-user-link.response'
import { AllFriendsResponse } from '../models/all-friends.response'

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  private http = inject(HttpClient)

  getUserByUserName(userName: string) {
    return this.http.get<GetUserResponse>(`/api/user/${userName}`)
    // .pipe(map((response) => response.user))
  }

  getUserByUserNameV2(userName: string) {
    return this.http.get<GetUserLinkResponse>(`/api/v2/user/${userName}`)
    // .pipe(map((response) => response.user))
  }

  updateDisplayPicture(request: UpdateDisplayPictureRequest) {
    return this.http.put(`/api/users/${request.userName}/dp`, {
      ...request,
    })
  }

  acceptFriendRequest(userName: string) {
    return this.http.put(`/api/users/${userName}/accept`, {
      userName,
    })
  }

  rejectFriendRequest(userName: string) {
    return this.http.put(`/api/users/${userName}/accept`, {
      userName,
    })
  }

  sendFriendRequest(userName: string) {
    return this.http.put(`/api/users/${userName}/add`, {
      friendUserName: userName,
    })
  }

  getAllFriends() {
    return this.http.get<AllFriendsResponse>(`/api/users?filter=friends`)
    // /users?filter=friends
  }
}
