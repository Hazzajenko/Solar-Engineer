export interface GroupChatMembersRemovedResponse {
  groupChatId: string;
  removedByUserId: string;
  memberIds: string[];
}