export interface GroupChatMessageModel {
  id: number;
  groupChatId: number;
  senderUsername: string;
  content: string;
  messageReadTimes: GroupChatReadTime[];
  messageSentTime: string;
}

export interface GroupChatReadTime {
  id: number;
  recipientUsername: string;
  messageReadTime: string;
}