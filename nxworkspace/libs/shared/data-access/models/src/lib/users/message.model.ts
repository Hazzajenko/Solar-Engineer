import { NotificationStatus } from '../signalr'

export interface MessageModel {
  id: number;
  senderUsername: string;
  recipientUsername: string;
  content: string;
  messageReadTime: string | null;
  messageSentTime: string;
  status: NotificationStatus;
}