export interface GroupChatMemberDto {
  id: number;
  groupChatId: number;
  userId: number;
  displayName: string;
  firstName: string;
  lastName: string;
  photoUrl: string;
  lastActive: string;
  role: string;
  joinedAt: string;
}