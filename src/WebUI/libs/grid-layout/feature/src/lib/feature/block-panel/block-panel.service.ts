import { catchError, combineLatestWith, map, retry, switchMap } from 'rxjs/operators'
import {
  LinksFacade,
  PanelsFacade,
  PathsFacade,
  SelectedFacade,
  StringsFacade,
  StringsSelectors,
} from '@grid-layout/data-access'
import { inject, Injectable } from '@angular/core'
import { Store } from '@ngrx/store'
import { Logger, LoggerService } from '@shared/logger'
import { EMPTY, Observable, of } from 'rxjs'
import { SelectedPanelVal, StringSelectedVal } from './models/panel-ng.model'
import { LINKED_TO_SELECTED, LinkedToSelected } from './models/is-panel-linked-to-selected'
import { PanelStringNameColor } from './models/panel-string-name-color'
import { SelectedStringWithTooltip } from './models/selected-string-with-tooltip'
import { BlockPanelStateModel } from './models/new-ng'

@Injectable()
export class BlockPanelService extends Logger {
  private panelsFacade = inject(PanelsFacade)
  private stringsFacade = inject(StringsFacade)
  private selectedFacade = inject(SelectedFacade)
  private pathsFacade = inject(PathsFacade)
  private linksFacade = inject(LinksFacade)
  // privat
  private store = inject(Store)

  constructor(logger: LoggerService) {
    super(logger)
  }

  join3(id: string): Observable<BlockPanelStateModel> {
    return this.panel$(id).pipe(
      this.throwIfNull$('panel'),
      retry(1),
      // map(panel => panel ?? th),

      switchMap((panel) => {
        // if (!panel) return EMPTY
        return of(panel).pipe(
          combineLatestWith(
            this.panelStringNameAndColor$(panel.stringId),
            this.isPanelSelected$(id),
            this.isPanelLinkedToSelected$(id),
            this.isPanelSelectedStringWithToolTipAndPanelLinkPaths$(panel.stringId, id),
            // this.isPanelSelectedStringWithToolTip$(panel.stringId),
          ),
          map(
            ([
              panel,
              stringNameColor,
              selected,
              linkedToSelected,
              selectedStringWithToolTipAndPanelLinkPaths,
            ]) => {
              return {
                panel,
                selected,
                linkedToSelected,
                links: {
                  isToLinkId: selectedStringWithToolTipAndPanelLinkPaths.isToLinkId,
                  linkPath: selectedStringWithToolTipAndPanelLinkPaths.panelLinkPath,
                  selectedLinkPath:
                    selectedStringWithToolTipAndPanelLinkPaths.selectedPanelLinkPath,
                },
                string: {
                  name: stringNameColor.stringName,
                  color: stringNameColor.stringColor,
                  selected: selectedStringWithToolTipAndPanelLinkPaths.stringSelected,
                  selectedTooltip: selectedStringWithToolTipAndPanelLinkPaths.stringTooltip,
                },
              }
            },
          ),
        )
      }),
    )
  }

  /*  links: {
      isToLinkId: boolean
      // isFromLinkId: boolean
      linkPath: PathModel | undefined
      selectedLinkPath: SelectedPathModel | undefined
    }*/
  panelLinkPath(id: string) {
    return this.pathsFacade.pathByPanelId$(id)
  }

  /*  panelLinkPath$: Observable<PanelPathModel | undefined> = this.pathsFacade.allPaths$.pipe(
      combineLatestWith(this.isSelectedString$),
      map(([paths, isSelectedString]) => {
        if (!isSelectedString) return undefined
        return paths.find((path) => path.panelId === this._id)
      }),
      map((path) => path),
    )*/

  selectedPanelLinkPath$(id: string) {
    return this.pathsFacade.selectedPanelLinkPath$.pipe(
      map((selectedPath) => {
        if (!selectedPath) return undefined
        return selectedPath.panelPaths.find((panel) => panel.panelId === id)
      }),
    )
  }

  isToLinkId$(id: string) {
    return this.linksFacade.toLinkId$.pipe(
      map((toLinkId) => {
        return toLinkId === id
      }),
    )
  }

  /*  }
    selectedPanelLinkPath$: Observable<SelectedPathModel | undefined> =
      this.pathsFacade.selectedPanelLinkPath$.pipe(
        map((selectedPath) => {
          if (!selectedPath) return undefined
          return selectedPath.panelPaths.find((panel) => panel.panelId === this._id)
        }),
      )
    private isToLinkId$: Observable<boolean> = this.linksFacade.toLinkId$.pipe(
      map((toLinkId) => {
        return toLinkId === this._id
      }),
    )*/

  panel$(id: string) {
    return this.panelsFacade.panelById$(id)
    // return this.panelsFacade.panelById$(id).pipe(this.logDebug$('panel$', 'Panel'))
    // return this.store.select(PanelsSelectors.selectPanelById({ id }))
  }

  /*  panelStringName$(stringId: string) {
      return this.stringsFacade.stringById$(stringId).pipe(
        this.throwIfNull$('string'),
        map((string) => string?.name),
      )
    }*/

  panelStringNameAndColor$(stringId: string): Observable<PanelStringNameColor> {
    return this.store.select(StringsSelectors.selectStringById({ id: stringId })).pipe(
      // return this.stringsFacade.stringById$(stringId).pipe(
      this.throwIfNull$('string', stringId),
      retry({
        delay: 1000,
        count: 10,
      }),
      // retry(() => stringId),
      catchError(() => EMPTY),
      map((string) => {
        return { stringName: string.name, stringColor: string.color }
      }),
    )
  }

  isPanelSelected$(id: string) {
    return this.selectedFacade.selectedId$.pipe(
      combineLatestWith(this.selectedFacade.multiSelectIds$),
      map(([singleSelectId, multiSelectIds]) => {
        if (multiSelectIds?.includes(id)) {
          return SelectedPanelVal.MULTI_SELECTED
        }
        if (singleSelectId === id) {
          return SelectedPanelVal.SINGLE_SELECTED
        }
        return SelectedPanelVal.NOT_SELECTED
      }),
    )
  }

  isPanelLinkedToSelected$(id: string): Observable<LinkedToSelected> {
    return this.selectedFacade.selectSelectedPositiveTo$.pipe(
      combineLatestWith(this.selectedFacade.selectSelectedNegativeTo$),
      map(([positiveToId, negativeToId]) => {
        if (positiveToId === id) {
          return LINKED_TO_SELECTED.POSITIVE
        }
        if (negativeToId === id) {
          return LINKED_TO_SELECTED.NEGATIVE
        }
        return LINKED_TO_SELECTED.NOT_LINKED
      }),
    )
  }

  isPanelSelectedStringWithToolTipAndPanelLinkPaths$(stringId: string, panelId: string) {
    return this.selectedFacade.selectedStringId$.pipe(
      combineLatestWith(
        // this.panelStringNameAndColor$(stringId),
        this.selectedFacade.selectedStringTooltip$,
        this.pathsFacade.pathByPanelId$(stringId),
        this.selectedPanelLinkPath$(panelId),
        this.isToLinkId$(panelId),
      ),
      map(
        ([
          selectedStringId,
          // stringNameAndColor,
          stringTooltip,
          panelLinkPath,
          selectedPanelLinkPath,
          isToLinkId,
        ]) => {
          if (selectedStringId === stringId) {
            return {
              stringSelected: StringSelectedVal.SELECTED,
              // stringName: stringNameAndColor.stringName,
              // stringColor: stringNameAndColor.stringColor,
              stringTooltip,
              panelLinkPath,
              selectedPanelLinkPath,
              isToLinkId,
            }
          }
          if (selectedStringId && selectedStringId !== stringId) {
            return {
              stringSelected: StringSelectedVal.OTHER_SELECTED,
              // stringName: undefined,
              // stringColor: undefined,
              stringTooltip: undefined,
              panelLinkPath: undefined,
              selectedPanelLinkPath: undefined,
              isToLinkId: false,
            }
          }
          return {
            stringSelected: StringSelectedVal.NOT_SELECTED,
            // stringName: undefined,
            // stringColor: undefined,
            stringTooltip: undefined,
            panelLinkPath: undefined,
            selectedPanelLinkPath: undefined,
            isToLinkId: false,
          }
        },
      ),
    )
  }

  isPanelSelectedStringWithToolTip$(stringId: string): Observable<SelectedStringWithTooltip> {
    return this.selectedFacade.selectedStringId$.pipe(
      combineLatestWith(this.selectedFacade.selectedStringTooltip$),
      map(([selectedStringId, stringTooltip]) => {
        if (selectedStringId === stringId) {
          return { stringSelected: StringSelectedVal.SELECTED, stringTooltip }
        }
        if (selectedStringId && selectedStringId !== stringId) {
          return { stringSelected: StringSelectedVal.OTHER_SELECTED, stringTooltip: undefined }
        }
        return { stringSelected: StringSelectedVal.NOT_SELECTED, stringTooltip: undefined }
      }),
    )
  }

  isPanelSelectedString$(stringId: string) {
    return this.selectedFacade.selectedStringId$.pipe(
      map((selectedStringId) => {
        if (selectedStringId === stringId) {
          return StringSelectedVal.SELECTED
        }
        if (selectedStringId && selectedStringId !== stringId) {
          return StringSelectedVal.OTHER_SELECTED
        }
        return StringSelectedVal.NOT_SELECTED
      }),
    )
  }

  selectedStringTooltip$() {
    return this.selectedFacade.selectedStringTooltip$.pipe(map((stringTooltip) => stringTooltip))
  }

  /*  selectedStringTooltip$ = this.selectedFacade.selectedStringTooltip$.pipe(
      combineLatestWith(this.isSelectedString$),
      map(([stringTooltip, isSelectedString]) => {
        if (!isSelectedString) return undefined
        return stringTooltip
      }),
    )*/

  /*  panelStringColor$(id: string) {
      return this.panel$(id).pipe(
        this.throwIfNull$(),
        switchMap((panel) => {
          return this.stringsFacade.stringById$(panel.stringId).pipe(
            this.throwIfNull$(),
            map((string) => string?.color),
          )
        }),
      )
    }

    panelStringColor$ = this.panelsFacade.allPanels$.pipe(
      map((panels) => panels.find((panel) => panel.id === this._id)),
      map((panel) => panel?.stringId),
      switchMap((stringId) => this.stringsFacade.stringById$(stringId!)),
      map((string) => {
        if (!string) {
          return undefined
        }
        return string.color
      }),
    )*/
  /*  panelStringName$: Observable<string | undefined> = this.panelsFacade
      .panelByIdOrThrow$(this._id)
      .pipe(
        delay(1000),
        // map((panel) => panel.stringId),
        switchMap((panel) => this.stringsFacade.stringByIdOrThrow$(panel.stringId)),
        map((string) => string.name),
      )*/
}
