export interface ProjectDto {
  name: string;
  colour: string;
  memberIds: string[];
  members: ProjectUserDto[];
  id: string;
  createdTime: string;
  lastModifiedTime: string;
  createdById: string;
}

export interface ProjectUserDto {
  id: string;
  role: string;
  canCreate: boolean;
  canDelete: boolean;
  canInvite: boolean;
  canKick: boolean;
  joinedAtTime: string;
}

export interface ProjectV2Dto {
  name: string;
  memberIds: string[];
  id: string;
  createdTime: string;
  lastModifiedTime: string;
  createdById: string;
}