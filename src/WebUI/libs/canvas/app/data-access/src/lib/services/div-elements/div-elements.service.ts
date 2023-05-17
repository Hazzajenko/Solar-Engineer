import { DivElement } from './div-element'
import { Injectable } from '@angular/core'
import { EntityStateFactory } from '@shared/utils'

@Injectable({
	providedIn: 'root',
})
export class DivElementsService {
	private _elements = new EntityStateFactory<HTMLDivElement>()

	_elementsLoaded = false

	constructor() {
		document.addEventListener('DOMContentLoaded', () => {
			/*	 InitialDivElements.forEach((element) => {
			 console.log('element', element)
			 this._elements.addEntity(getHtmlDivElementById(element))
			 })*/
			this.elementsLoaded = true
		})
	}

	set elementsLoaded(value: boolean) {
		this._elementsLoaded = value
		// eslint-disable-next-line @typescript-eslint/no-empty-function
		document.removeEventListener('DOMContentLoaded', () => {})
	}

	initElements() {
		/*		InitialDivElements.forEach((element) => {
		 this._elements.addEntity(getHtmlDivElementById(element))
		 })
		 console.log('elements loaded', this._elements.getAll())
		 this.elementsLoaded = true*/
	}

	addElement(element: HTMLDivElement) {
		this._elements.addEntity(element)
	}

	getElementById(id: DivElement) {
		if (!this._elementsLoaded) {
			// console.log('elements not loaded')
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
		console.log('element', element)
		return element as HTMLDivElement
	}

	getElementByIdOrUndefined(id: DivElement) {
		/*		if (!this._elementsLoaded) {
		 // console.log('elements not loaded')
		 return {} as HTMLDivElement
		 }*/
		const element = this._elements.getEntityById(id)
		if (!element) {
			const newElement = document.getElementById(id)
			if (!newElement) {
				return undefined
				// throw new Error('No element found')
			}
			this._elements.addEntity(newElement as HTMLDivElement)
			return newElement as HTMLDivElement
		}
		// console.log('element', element)
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
