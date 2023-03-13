import { Directive, EventEmitter, inject, NgZone, OnInit, Output, Renderer2 } from '@angular/core'
import { MatSnackBar } from '@angular/material/snack-bar'
import {
  GridEventService,
  GridFacade,
  GridStoreService,
  LinksStoreService,
  MultiEventService,
  MultiFacade,
  MultiStoreService,
  PanelsFacade,
  PanelsStoreService,
  SelectedEventService,
  SelectedFacade,
  SelectedStoreService,
  StringsEventService,
  StringsFacade,
  UiStoreService,
} from '@grid-layout/data-access'

import { GridMode } from '@shared/data-access/models'
import { firstValueFrom } from 'rxjs'

@Directive({
  selector: '[appKeyMap]',
  standalone: true,
})
export class KeyMapDirective implements OnInit {
  private gridFacade = inject(GridFacade)

  private multiFacade = inject(MultiFacade)
  private selectedFacade = inject(SelectedFacade)
  private panelsFacade = inject(PanelsFacade)
  private gridFactory = inject(GridEventService)
  private selectedFactory = inject(SelectedEventService)
  private multiFactory = inject(MultiEventService)
  private multiStore = inject(MultiStoreService)
  private gridStore = inject(GridStoreService)
  private linksStore = inject(LinksStoreService)
  private selectedStore = inject(SelectedStoreService)
  private panelsStore = inject(PanelsStoreService)
  private stringsFacade = inject(StringsFacade)
  private stringFactory = inject(StringsEventService)
  private uiStore = inject(UiStoreService)
  private snackBar = inject(MatSnackBar)
  private renderer = inject(Renderer2)

  @Output() keyUp: EventEmitter<string> = new EventEmitter<string>()

  constructor(private ngZone: NgZone) {}

  ngOnInit() {
    this.setupMouseEventListeners()
  }

  private setupMouseEventListeners() {
    this.ngZone.runOutsideAngular(() => {
      this.renderer.listen(window, 'keyup', (event: KeyboardEvent) => {
        event.stopPropagation()
        event.preventDefault()
        this.onKeyUpHandler(event).catch((err) => console.error(err))
      })
    })
  }

  private async onKeyUpHandler(event: KeyboardEvent) {
    switch (event.key) {
      case 'Alt':
        {
          const multiState = await firstValueFrom(this.multiFacade.state$)
          if (multiState.locationStart && event.key === 'Alt') {
            this.multiStore.dispatch.clearMultiState()
          }
        }
        break
      case 's': {
        const selectedId = await this.selectedFacade.selectedId
        if (!selectedId) break

        const panel = await this.panelsFacade.panelById(selectedId)
        if (!panel) break

        await this.gridFactory.select(GridMode.SELECT)
        await this.selectedFactory.selectString(panel.stringId)
        this.snackBar.open('String Selected', 'OK', {
          duration: 5000,
          horizontalPosition: 'start',
          verticalPosition: 'bottom',
        })

        break
      }
      case 'l': {
        const gridMode = await this.gridStore.select.gridMode
        if (gridMode === GridMode.LINK) {
          this.gridStore.dispatch.selectGridMode(GridMode.SELECT)
          this.linksStore.dispatch.clearLinkState()
          this.snackBar.open('Link Mode Off', 'OK', {
            duration: 5000,
            horizontalPosition: 'start',
            verticalPosition: 'bottom',
          })
          break
        }
        const isStringSelected = await this.selectedStore.select.selectedStringId
        if (!isStringSelected) break
        this.gridStore.dispatch.selectGridMode(GridMode.LINK)
        this.selectedStore.dispatch.clearSingleSelected()
        this.snackBar.open('Link Mode On', 'OK', {
          duration: 5000,
          horizontalPosition: 'start',
          verticalPosition: 'bottom',
        })

        break
      }
      case 'c':
        this.gridStore.dispatch.selectCreateMode()
        break
      case 'x': {
        const multiSelectIds = await this.selectedFacade.multiSelectIds
        if (!multiSelectIds) break
        const amountOfStrings = await this.stringsFacade.totalStrings()
        const newStringName = `S${amountOfStrings + 1}`
        // const newStringName = `STRING_${amountOfStrings + 1}`
        const result = await this.stringFactory.addSelectedToNew(newStringName)
        if (!result) break
        this.snackBar.open(`Created String ${result?.name}`, 'OK', {
          duration: 5000,
          horizontalPosition: 'start',
          verticalPosition: 'bottom',
        })
        break
      }
      case 'r': {
        // this.elementRef.nativeElement.style.top = '0px'
        // this.elementRef.nativeElement.style.left = '0px'
        this.keyUp.emit('r')
        this.uiStore.dispatch.keyPressed('r')
        // this.keyUp.emit('reset')
        break
      }
      case 'Tab': {
        this.uiStore.dispatch.toggleNavMenu()
        // this.keyUp.emit('reset')
        // this.isDragging = false
        // this.multiStore.dispatch.clearMultiState()
        // this.elementRef.nativeElement.style.cursor = ''
        break
      }
      case 'Control': {
        this.keyUp.emit('Control')
        this.uiStore.dispatch.keyPressed('Control')
        // this.keyUp.emit('reset')
        // this.isDragging = false
        // this.multiStore.dispatch.clearMultiState()
        // this.elementRef.nativeElement.style.cursor = ''
        break
      }
      case 'Delete': {
        const singleAndMultiIds = await this.selectedFacade.singleAndMultiIds
        if (singleAndMultiIds.multiIds && singleAndMultiIds.multiIds.length > 0) {
          await this.multiFactory.deleteMany(singleAndMultiIds.multiIds)
          break
        }
        if (singleAndMultiIds.singleId) {
          await this.panelsStore.dispatch.deletePanel(singleAndMultiIds.singleId)
          break
        }
        break
      }
      case 'Escape':
        this.gridStore.dispatch.clearEntireGridState()
        break
    }
  }
}
