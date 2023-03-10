export const PROJECT_SIGNALR_TYPE = {
  CREATE: 'Create',
  UPDATE: 'Update',
  DELETE: 'Delete',
  CREATE_MANY: 'CreateMany',
  UPDATE_MANY: 'UpdateMany',
  DELETE_MANY: 'DeleteMany',
} as const

export type ProjectEventAction = (typeof PROJECT_SIGNALR_TYPE)[keyof typeof PROJECT_SIGNALR_TYPE]
