export const DesignEntityType = {
  Panel: 'panel',
  String: 'string',
} as const

export type DesignEntityType = (typeof DesignEntityType)[keyof typeof DesignEntityType]

export function isDesignEntityType(value: string): value is DesignEntityType {
  return Object.values(DesignEntityType).includes(value as DesignEntityType)
}
