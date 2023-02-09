export interface AppUserLinkModel {
  id: number
  displayName: string
  nickName: string
  created: string
  becameFriendsTime: string | null
  isFriend: boolean
  userToUserStatus: UserToUserStatus
  toUserStatusEvent: ToUserStatus
  toUserStatusDate: string
  firstName: string
  lastName: string
  photoUrl: string
  lastActive: string
  isOnline: boolean
}

/*ToUserStatusEvent = appUser.Id.Equals(request.AppUserReceivedId)
  ? request.AppUserReceivedStatusEvent
  : request.AppUserRequestedStatusEvent,
  ToUserStatusDate = appUser.Id.Equals(request.AppUserReceivedId)
    ? request.AppUserReceivedStatusDate
    : request.AppUserRequestedStatusDate,*/

export type ToUserStatus = keyof typeof import('./user-status.types')

export enum UserToUserStatus {
  None,
  Pending,
  Approved,
  Rejected,
  Blocked,
}
