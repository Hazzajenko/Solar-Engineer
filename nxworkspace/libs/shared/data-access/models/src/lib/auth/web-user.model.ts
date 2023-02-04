export interface WebUserModel {
  id: number
  email: string
  firstName: string
  lastName: string
  userName: string
  photoUrl: string
  created: string
  lastActive: string
  isOnline: boolean
  isServer: boolean
  isFriend: boolean
  becameFriendsTime: string | null
}
