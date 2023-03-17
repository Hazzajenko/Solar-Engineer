export const PROJECTS_SORTS = {
  UNDEFINED: 'Undefined',
  NAME: 'Name',
  LAST_MODIFIED: 'LastModified',
  CREATED: 'Created',
} as const

export type ProjectSorts = (typeof PROJECTS_SORTS)[keyof typeof PROJECTS_SORTS]
