export interface AppUserLinkModel {
  id: number
  userName: string
  nickName: string
  created: string
  becameFriendsTime: string | null
  isFriend: boolean
  userToUserStatus: UserToUserStatus
  firstName: string
  lastName: string
  photoUrl: string
  lastActive: string
  isOnline: boolean
}

export enum UserToUserStatus {
  None,
  Pending,
  Approved,
  Rejected,
  Blocked,
}
