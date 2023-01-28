export interface GroupChatMemberModel {
  id: number
  groupChatId: number
  userName: string
  firstName: string
  lastName: string
  lastActive: string
  photoUrl: string
  role: string
  joinedAt: string
  isOnline: boolean
}
