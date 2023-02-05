import { FriendRequestModel } from './friendrequest.model'

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

export type NotificationType = keyof typeof import('./notification.types')
// const hi : NotificationType = 'PROJECT_INVITE_REJECTED'

/*export enum NotificationType {
  Unknown,
  FriendRequest,
  Message,
  ProjectInvite,
}*/

export enum NotificationStatus {
  Unread,
  Read,
}
