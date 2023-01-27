export interface FriendRequestModel {
  requestedByUserName: string
  requestedToUserName: string
  becameFriendsTime: string | null
  friendRequestFlag: FriendRequestFlag
}

export enum FriendRequestFlag {
  None,
  Approved,
  Rejected,
  Blocked,
  Spam,
}
