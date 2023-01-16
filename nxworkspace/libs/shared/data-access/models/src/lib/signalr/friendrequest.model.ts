export interface FriendRequestModel {
  requestedByUsername: string;
  requestedToUsername: string;
  becameFriendsTime: string | null;
  friendRequestFlag: FriendRequestFlag;
}

export enum FriendRequestFlag {
  None,
  Approved,
  Rejected,
  Blocked,
  Spam
}