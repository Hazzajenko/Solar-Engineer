export interface NotificationModel {
  id: number
  appUserId: number
  appUserDisplayName: string
  notificationFromId: number
  notificationFromDisplayName: string
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
