export interface InviteToGroupChatRequest {
  groupChatId: number
  invites: MemberInviteModel[]
}

export interface MemberInviteModel {
  userName: string
  role: string
}
