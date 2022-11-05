export interface UserProjectModel {
  projectId?: number;
  userId: number;
  joinedAt?: string;
  role?: string;
  canCreate?: boolean;
  canDelete?: boolean;
  canInvite?: boolean;
  canKick?: boolean;
}
