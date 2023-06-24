export interface GroupChatMessageUpdateDto {
  id: number;
  changes: GroupChatMessageChanges;
}

export interface GroupChatMessageChanges {
  senderInGroup: boolean;
}