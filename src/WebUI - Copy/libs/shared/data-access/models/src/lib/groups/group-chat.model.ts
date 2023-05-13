export interface GroupChatModel {
  id: number
  name: string
  photoUrl: string
  permissions: PermissionsModel
}

export interface PermissionsModel {
  canInvite: boolean
  canKick: boolean
}
