export const HOME_NAV_ROUTE = {
  HOME: 'home',
  PROJECTS: 'projects',
  SOCIAL: 'social',
} as const

export type HomeNavRoute = (typeof HOME_NAV_ROUTE)[keyof typeof HOME_NAV_ROUTE]
