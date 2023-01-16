import { FriendRequestModel } from './friendrequest.model'

export interface NotificationModel {
  id: number
  username: string;
  type: NotificationType;
  timeCreated: string;
  status: NotificationStatus;
  notification: FriendRequestModel;
}

export enum NotificationType {
  Unknown,
  FriendRequest,
  Message,
  ProjectInvite
}

export enum NotificationStatus {
  Unread,
  Read
}