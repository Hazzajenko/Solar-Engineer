import { HttpClient } from '@angular/common/http'
import { inject, Injectable } from '@angular/core'
import { GetUserLinkResponse } from '../models/get-user-link.response'
import { GetRecipientUserFriendsResponse } from '../models/get-recipient-user-friends.response'

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  private http = inject(HttpClient)

  getRecipientUserFriends(userName: string) {
    return this.http.get<GetRecipientUserFriendsResponse>(`/api/users/${userName}/friends`)
  }

  getUserByUserNameV2(userName: string) {
    return this.http.get<GetUserLinkResponse>(`/api/v2/user/${userName}`)
    // .pipe(map((response) => response.user))
  }

  /*getUserByUserName(userName: string) {
    return this.http.get<GetUserResponse>(`/services/user/${userName}`)
    // .pipe(map((response) => response.user))
  }

  getUserByUserNameV2(userName: string) {
    return this.http.get<GetUserLinkResponse>(`/services/v2/user/${userName}`)
    // .pipe(map((response) => response.user))
  }

  getRecipientUserFriends(userName: string) {
    return this.http.get<GetRecipientUserFriendsResponse>(`/services/users/${userName}/friends`)
  }

  updateDisplayPicture(request: UpdateDisplayPictureRequest) {
    return this.http.put(`/services/users/${request.userName}/dp`, {
      ...request,
    })
  }

  acceptFriendRequest(userName: string) {
    return this.http.put(`/services/users/${userName}/accept`, {
      userName,
    })
  }

  rejectFriendRequest(userName: string) {
    return this.http.put(`/services/users/${userName}/accept`, {
      userName,
    })
  }

  sendFriendRequest(userName: string) {
    return this.http.put(`/services/users/${userName}/add`, {
      friendUserName: userName,
    })
  }

  getAllFriends() {
    return this.http.get<AllFriendsResponse>(`/services/users?filter=friends`)
    // /users?filter=friends
  }*/
}
