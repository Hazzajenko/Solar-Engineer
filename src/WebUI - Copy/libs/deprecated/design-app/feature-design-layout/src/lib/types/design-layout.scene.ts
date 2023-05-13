export const ElementType = {
	Panel: 'panel',
} as const

export type ElementType = (typeof ElementType)[keyof typeof ElementType]

type _DesignElementBase = Readonly<{
	id: string
	x: number
	y: number
	backgroundColor: string
	width: number
	height: number
	angle: number
	type: ElementType
}>

export type DesignElement = _DesignElementBase &
	Readonly<{
		points: readonly [number, number][]
	}>

export type PanelElement = _DesignElementBase &
	Readonly<{
		type: typeof ElementType.Panel
	}>

export class DesignLayoutScene {
	private static _sceneMapById = new Map<string, DesignLayoutScene>()
	private _elementsMap = new Map<DesignElement['id'], DesignElement>()
	private _elements: readonly DesignElement[] = []

	static mapElementToScene(elementKey: string, scene: DesignLayoutScene) {
		this._sceneMapById.set(elementKey, scene)
	}

	public getElement<T extends DesignElement>(id: T['id']): T | null {
		return (this._elementsMap.get(id) as T | undefined) || null
	}

	public mapElements(iteratee: (element: DesignElement) => DesignElement): boolean {
		let didChange = false
		const newElements = this._elements.map((element) => {
			const nextElement = iteratee(element)
			if (nextElement !== element) {
				didChange = true
			}
			return nextElement
		})
		if (didChange) {
			this.replaceAllElements(newElements)
		}
		return didChange
	}

	public replaceAllElements(nextElements: readonly DesignElement[]) {
		this._elements = nextElements
		this._elementsMap.clear()
		nextElements.forEach((element) => {
			this._elementsMap.set(element.id, element)
			DesignLayoutScene.mapElementToScene(element.id, this)
		})
		// this.nonDeletedElements = getNonDeletedElements(this.elements)
		// this.informMutation()
	}

	/*  informMutation() {
   for (const callback of Array.from(this.callbacks)) {
   callback();
   }
   }*/

	// elements: readonly ExcalidrawElement[];
	// appState: Readonly<AppState>;
	// commitToHistory: boolean
}
