export enum TypeModel {
  UNDEFINED,
  PROJECT,
  INVERTER,
  TRACKER,
  STRING,
  PANEL,
  CABLE,
  JOIN,
  DISCONNECTIONPOINT,
  TRAY,
  RAIL,
}

const UserRoles = {
  User: 'user',
  Admin: 'admin',
  Staff: 'staff',
} as const
type UserRole = ObjectValues<typeof UserRoles>

type ObjectValues<T> = T[keyof T]