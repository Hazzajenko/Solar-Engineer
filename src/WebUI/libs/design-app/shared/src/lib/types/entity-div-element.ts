import { isDesignEntityType } from '@design-app/feature-panel'
import { EntityType } from '@design-app/shared'

export type EntityDivElement = {
  id: string
  type: EntityType
  element: HTMLDivElement
}

export type EntityDivElementWithPoints = EntityDivElement & {
  points: [number, number][]
}

export type EntityElement = {
  id: string
  type: EntityType
  x: number
  y: number
  width: number
  height: number
  // angle: number
}

export function extractHtmlDivElement(
  event: MouseEvent | PointerEvent,
): HTMLDivElement | undefined {
  return event.composedPath()[0] as HTMLDivElement
}

export function findParentContextMenuElement(element: HTMLDivElement): HTMLDivElement | undefined {
  let parent = element.parentElement as HTMLDivElement
  if (!parent) return undefined
  if (parent.id === 'context-menu') return parent
  parent = parent.parentElement as HTMLDivElement
  if (parent.id === 'context-menu') return parent
  parent = parent.parentElement as HTMLDivElement
  if (parent.id === 'context-menu') return parent
  parent = parent.parentElement as HTMLDivElement
  if (parent.id === 'context-menu') return parent
  parent = parent.parentElement as HTMLDivElement
  if (parent.id === 'context-menu') return parent
  return undefined
}

export function findParentContextMenuElementV2(
  element: HTMLDivElement,
): HTMLDivElement | undefined {
  if (isRoleMenuItem(element)) return element
  let parent = element.parentElement as HTMLDivElement
  if (!parent) return undefined
  if (isRoleMenuItem(parent)) return parent
  parent = parent.parentElement as HTMLDivElement
  if (isRoleMenuItem(parent)) return parent
  parent = parent.parentElement as HTMLDivElement
  if (isRoleMenuItem(parent)) return parent
  parent = parent.parentElement as HTMLDivElement

  return undefined
}

export function isRoleMenuItem(element: HTMLDivElement): boolean {
  return element.getAttribute('role') === 'menuitem'
}

export function isContextMenu(element: HTMLDivElement): boolean {
  return element.id === 'context-menu'
}

export function extractEntityDiv(event: MouseEvent | PointerEvent): EntityDivElement | undefined {
  const element = event.composedPath()[0] as HTMLDivElement
  const id = element.getAttribute('id')
  if (!id) return undefined
  const type = element.getAttribute('type') as EntityType | undefined
  if (!type || !isDesignEntityType(type)) return undefined

  return {
    id,
    type,
    element,
  }
}