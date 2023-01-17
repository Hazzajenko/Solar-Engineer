import { HttpClient } from '@angular/common/http'
import { inject, Injectable } from '@angular/core'
import { AcceptFriendResponse } from '../models/accept-friend.response'
import { AllFriendsResponse } from '../models/all-friends.response'


@Injectable({
  providedIn: 'root',
})
export class FriendsService {

  private http = inject(HttpClient)

  acceptFriendRequest(username: string) {
    return this.http.post<AcceptFriendResponse>(`/api/friend/accept/${username}`, {
      username,
    })
  }

  getAllFriends() {
    return this.http.get<AllFriendsResponse>(`/api/friends`)
  }

}
