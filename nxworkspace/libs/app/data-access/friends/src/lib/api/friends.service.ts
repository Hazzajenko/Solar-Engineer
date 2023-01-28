import { HttpClient } from '@angular/common/http'
import { inject, Injectable } from '@angular/core'
import { AcceptFriendResponse } from '../models/accept-friend.response'
import { AllFriendsResponse } from '../models/all-friends.response'
import { SendFriendRequestResponse } from '../models/send-friend-request.response'

@Injectable({
  providedIn: 'root',
})
export class FriendsService {
  private http = inject(HttpClient)

  acceptFriendRequest(userName: string) {
    return this.http.post<AcceptFriendResponse>(`/api/friend/accept/${userName}`, {
      userName,
    })
  }

  sendFriendRequest(friendUserName: string) {
    return this.http.post<SendFriendRequestResponse>(`/api/friend/add/${friendUserName}`, {
      friendUserName,
    })
  }

  getAllFriends() {
    return this.http.get<AllFriendsResponse>(`/api/friends`)
  }
}
