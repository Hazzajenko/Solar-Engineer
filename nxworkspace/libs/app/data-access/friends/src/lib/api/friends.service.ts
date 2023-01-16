import { HttpClient } from '@angular/common/http'
import { inject, Injectable } from '@angular/core'
import { AcceptFriendResponse } from 'libs/app/data-access/friends/src/lib/models/accept-friend.response'

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

}
