import { DivElement, InitialDivElements } from './div-element'
import { Injectable } from '@angular/core'
import { EntityStateFactory } from '@design-app/utils'
import { getHtmlDivElementById } from '@shared/utils'


@Injectable({
	providedIn: 'root',
})
export class DivElementsService {
	private _elements = new EntityStateFactory<HTMLDivElement>()

	_elementsLoaded = false

	constructor() {
		document.addEventListener('DOMContentLoaded', () => {
			InitialDivElements.forEach((element) => {
				this._elements.addEntity(getHtmlDivElementById(element))
			})
			this.elementsLoaded = true
		})
	}

	set elementsLoaded(value: boolean) {
		this._elementsLoaded = value
		// eslint-disable-next-line @typescript-eslint/no-empty-function
		document.removeEventListener('DOMContentLoaded', () => {})
	}

	getElementById(id: DivElement) {
		if (!this._elementsLoaded) {
			return {} as HTMLDivElement
		}
		const element = this._elements.getEntityById(id)
		if (!element) {
			const newElement = document.getElementById(id)
			if (!newElement) {
				throw new Error('No element found')
			}
			this._elements.addEntity(newElement as HTMLDivElement)
			return newElement as HTMLDivElement
		}
		return element as HTMLDivElement
	}

	getElements() {
		return this._elements.getAll()
	}

	getElementsObject() {
		return this._elements.getDictionary()
	}

	removeElement(id: string) {
		this._elements.removeEntity(id)
	}

	removeElements(ids: string[]) {
		this._elements.removeManyEntities(ids)
	}
}