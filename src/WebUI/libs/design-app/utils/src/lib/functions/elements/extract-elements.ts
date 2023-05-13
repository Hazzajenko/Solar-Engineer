import { roundToTwoDecimals } from '../math'
import { EntityDivElement, EntityElement, EntityType } from '@design-app/shared'
import { isDesignEntityType } from '@design-app/feature-panel'

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
	return undefined
}

export function isRoleMenuItem(element: HTMLDivElement): boolean {
	return element.getAttribute('role') === 'menuitem'
}

/*export function isContextMenu(element: HTMLDivElement): boolean {
 return element.id === 'context-menu'
 }*/

export function extractEntityRect(event: MouseEvent | PointerEvent): EntityElement | undefined {
	const entity = extractEntityDiv(event)
	if (!entity) return undefined
	const { id, type } = entity

	const rect = entity.element.getBoundingClientRect()
	const x = roundToTwoDecimals(rect.x)
	const y = roundToTwoDecimals(rect.y)
	const width = roundToTwoDecimals(rect.width)
	const height = roundToTwoDecimals(rect.height)

	return {
		id,
		type,
		x,
		y,
		width,
		height,
	}
}

export function extractEntityRectFromTarget(element: HTMLDivElement): EntityElement | undefined {
	const entity = extractEntityDivFromTarget(element)
	if (!entity) return undefined
	const { id, type } = entity

	const rect = entity.element.getBoundingClientRect()
	const x = roundToTwoDecimals(rect.x)
	const y = roundToTwoDecimals(rect.y)
	const width = roundToTwoDecimals(rect.width)
	const height = roundToTwoDecimals(rect.height)

	return {
		id,
		type,
		x,
		y,
		width,
		height,
	}
}

export function extractEntityDivFromTarget(element: HTMLDivElement): EntityDivElement | undefined {
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

export function extractEntityDiv(event: MouseEvent | PointerEvent): EntityDivElement | undefined {
	const element = event.target as HTMLDivElement
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
