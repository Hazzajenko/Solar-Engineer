export interface AppUserProjectDto {
  appUserId: string;
  projectId: string;
  role: string;
  canCreate: boolean;
  canDelete: boolean;
  canInvite: boolean;
  canKick: boolean;
  createdTime: string;
  lastModifiedTime: string;
}