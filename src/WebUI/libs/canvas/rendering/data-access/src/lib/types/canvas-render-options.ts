import {
	CompleteEntityBounds,
	CursorType,
	NearbyEntity,
	Point,
	SpotInBox,
	TransformedPoint,
} from '@shared/data-access/models'
import {
	EntityBase,
	OpenCircuitChainWithIndex,
	PanelId,
	PanelLinkModel,
	PanelLinkRequest,
	PanelModel,
	PanelSymbol,
	StringModel,
	UserPoint,
} from '@entities/shared'
import { GraphicsState } from '@canvas/graphics/data-access'
import { AppState } from '@canvas/app/data-access'
import { SelectedState } from '@canvas/selected/data-access'

export const createRenderOptions = (options: PartialRenderOptions): PartialRenderOptions => options

export type PartialRenderOptions = Partial<CanvasRenderOptions>

export type CanvasRenderOptions = {
	excludedEntityIds: string[]
	customEntities: EntityBase[]
	currentLocation: TransformedPoint
	shouldRenderSelectedEntitiesBox: boolean
	shouldRenderSelectedStringBox: boolean
	customPanels: PanelModel[]
	singleToMoveId: string
	singleToMovePanel: PanelModel
	multipleToMoveIds: string[]
	multipleToMovePanels: PanelModel[]
	singleToRotateId: string
	singleToRotatePanel: PanelModel
	multipleToRotateIds: string[]
	multipleToRotatePanels: PanelModel[]
	selectionBox: {
		x: number
		y: number
		width: number
		height: number
	}
	creationBox: {
		x: number
		y: number
		width: number
		height: number
		spots: SpotInBox[]
	}
	nearby: {
		axisPreviewRect: CompleteEntityBounds
		mouseBounds: CompleteEntityBounds
		closestEntity: NearbyEntity
		snapToGridBool: boolean
		entityToMove?: EntityBase
		// isMovingExistingEntity: boolean
	}
	multipleToMoveSpotsTakenIds: string[]
	clickNearEntityBounds: {
		top: number
		left: number
		width: number
		height: number
	}
	creationPreviewBounds: {
		top: number
		left: number
		width: number
		height: number
	}
	cursor: CursorType
	transformedPoint: Point
	panelUnderMouse: PanelModel
	panelLinkUnderMouse: PanelLinkModel
	draggingSymbolLinkLine: {
		mouseDownPanelSymbol: PanelSymbol
		transformedPoint: TransformedPoint
		nearbyPanelToLinkLine: PanelModel | undefined
		possibleSymbolLink?: PanelSymbol
	}
	panelLinkRequest: {
		request: PanelLinkRequest
		currentPoint: TransformedPoint
		panel: PanelModel
		nearbyPanelToLinkLine: PanelModel | undefined
	}
	userPoints: UserPoint[]
}

export type DrawPanelsOptions = {
	panels: PanelModel[]
	openCircuitChains: OpenCircuitChainWithIndex[]
	selectedString: StringModel | undefined
	singleSelectedPanel: PanelModel | undefined
	hoveringOverPanelId: PanelId | undefined
	requestingLink: PanelLinkRequest | undefined
	appState: AppState
	graphicsState: GraphicsState
	selectedState: SelectedState
}

/*
 export type CanvasRenderOptionsV2 = {
 drawFns?: ((ctx: CanvasRenderingContext2D) => void)[]
 drawFnsAtMiddle?: ((ctx: CanvasRenderingContext2D) => void)[]
 drawFnsAtEnd?: ((ctx: CanvasRenderingContext2D) => void)[]
 excludedEntityIds?: string[]
 customEntities?: CanvasEntity[]
 currentLocation?: TransformedPoint
 shouldRenderSelectedEntitiesBox?: boolean
 shouldRenderSelectedStringBox?: boolean
 }
 */
