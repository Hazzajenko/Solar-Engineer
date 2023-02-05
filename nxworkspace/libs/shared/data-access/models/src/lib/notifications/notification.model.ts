export interface NotificationModel {
  id: number
  appUserId: number
  appUserUserName: string
  notificationFromId: number
  notificationFromUserName: string
  content: string
  type: NotificationType
  created: string
  seenByAppUser: boolean
  deletedByAppUser: boolean
  cancelledBySender: boolean
}

export enum NotificationType {
  Unknown,
  FriendRequest,
  Message,
  ProjectInvite,
}
