export const HOME_PAGE = {
  UNDEFINED: 'Undefined',
  DASHBOARD: 'Dashboard',
  TEAMS: 'Teams',
  PROJECTS: 'Projects',
  MESSAGES: 'Messages',
  SOCIAL: 'Social',
  SETTINGS: 'Settings',
} as const

export type HomePage = (typeof HOME_PAGE)[keyof typeof HOME_PAGE]
