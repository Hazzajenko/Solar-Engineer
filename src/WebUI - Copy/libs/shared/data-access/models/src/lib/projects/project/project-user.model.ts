// export type ProjectUserModel = Pick<AuthUserModel, 'id' | 'userName' | 'displayName' | 'photoUrl'>
export interface ProjectUserModel {
  id: string
  userName: string
  displayName: string
  photoUrl: string
  joinedAtTime: string
  // lastModifiedTime: string
}
