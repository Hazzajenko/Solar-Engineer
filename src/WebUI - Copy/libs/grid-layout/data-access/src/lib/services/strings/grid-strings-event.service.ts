import { inject, Injectable } from '@angular/core'
import { GridFacade, GridPanelsFacade, GridPanelsStoreService, GridSelectedFacade, GridSelectedStoreService, GridStoreService, GridStringsFacade, GridStringsStoreService, LinksPathService, toUpdatePanelArray } from '../'
import { ProjectsFacade } from '@projects/data-access'
import { GridMode, GridPanelModel, GridStringModel, UndefinedString } from '@shared/data-access/models'
import { BaseService } from '@shared/logger'
import { UpdateStr } from '@ngrx/entity/src/models'
import { throwExpression } from '@shared/utils'

@Injectable({
  providedIn: 'root',
})
export class GridStringsEventService
  extends BaseService {
  private readonly projectsFacade = inject(ProjectsFacade)
  private readonly gridFacade = inject(GridFacade)
  private readonly selectedFacade = inject(GridSelectedFacade)
  private readonly panelsFacade = inject(GridPanelsFacade)
  private readonly stringsFacade = inject(GridStringsFacade)
  private linksPathService = inject(LinksPathService)
  private gridStore = inject(GridStoreService)
  private stringsStore = inject(GridStringsStoreService)
  private selectedStore = inject(GridSelectedStoreService)
  private panelsStore = inject(GridPanelsStoreService)
  // logger = inject(LoggerService)

  /*  constructor(logger: LoggerService) {
   super(logger)
   }*/

  async createNoDispatch(stringName: string) {
    const project = await this.projectsFacade.selectedProject()
    const userId = (await this.userId) ?? throwExpression('User not logged in')
    return new GridStringModel({
      projectId:   project.id,
      name:        stringName,
      color:       'undefined',
      parallel:    false,
      createdById: userId,
    })
  }

  async create(stringName: string) {
    const project = await this.projectsFacade.selectedProject()
    const userId = (await this.userId) ?? throwExpression('User not logged in')

    // console.log(project)
    /*    if (!project) {
     return
     }*/
    const string = new GridStringModel({
      projectId:   project.id,
      name:        stringName,
      color:       'undefined',
      parallel:    false,
      createdById: userId,
    })
    this.stringsStore.dispatch.createString(string)
    return string
  }

  async createWithPanels(stringName: string, panelIds: string[]) {
    const string = await this.createNoDispatch(stringName)
    this.stringsStore.dispatch.createStringWithPanels(string, panelIds)
    return string
  }

  async select(stringId: string) {
    this.gridStore.dispatch.selectGridMode(GridMode.SELECT)
    const string = await this.stringsFacade.stringById(stringId)
    if (!string) return
    if (string.name === UndefinedString) {
      this.logDebug('select string undefined')
      return
    }
    const panels = await this.panelsFacade.panelsByStringId(stringId)
    this.selectedStore.dispatch.selectString(string, panels)
    // this.linksPathService.orderPanelsInLinkOrderWithLinkAsync()
    // orderPanelsInLinkOrderWithLinkAsync
  }

  async addSelectedToNew(stringName: string) {
    /*    const selectedPanelIds = await firstValueFrom(
     this.selectedStore.select.multiSelectIds$
     .pipe(combineLatestWith(this.panelsStore.select.allPanels$))
     .pipe(
     map(([multiSelectIds, panels]) => {
     return panels.filter((p) => multiSelectIds?.includes(p.id)).map((panels) => panels.id)
     }),
     ),
     )*/
    const selectedPanelIds = await this.selectedFacade.multiSelectPanelIds()
    // console.log(selectedPanelIds)
    if (!selectedPanelIds) {
      return
    }
    const string = await this.createWithPanels(stringName, selectedPanelIds)
    // const string = await this.create(stringName)
    // console.log(string)
    /*    if (!(string instanceof StringModel)) {
     return
     }*/
    /*    const updates: Partial<PanelModel> = {
     stringId: string.id,
     }
     const selectedPanelUpdates = toUpdatePanelArray(selectedPanelIds, updates)

     this.panelsStore.dispatch.updateManyPanels(selectedPanelUpdates)*/
    this.selectedStore.dispatch.clearSelected()

    // await this.select(string.id)
    return string
  }

  async addSelectedToExisting(stringId: string) {
    /*    const selectedPanelIds = await firstValueFrom(
     combineLatest([
     this.selectedFacade.selectedIdWithType$,
     this.selectedFacade.multiSelectIds$,
     this.panelsFacade.allPanels$,
     ]).pipe(
     map(([selectedIdWithType, multiSelectIds, panels]) => {
     if (multiSelectIds) {
     return panels.filter((p) => multiSelectIds?.includes(p.id)).map((panels) => panels.id)
     }
     if (selectedIdWithType.singleSelectId && selectedIdWithType.type === BLOCK_TYPE.PANEL) {
     return [selectedIdWithType.singleSelectId]
     }
     return undefined
     }),
     ),
     )*/

    const selectedPanelIds = await this.selectedFacade.multiSelectPanelIds()

    if (!selectedPanelIds) {
      return
    }

    const updates: Partial<GridPanelModel> = {
      stringId,
    }

    const selectedPanelUpdates = toUpdatePanelArray(selectedPanelIds, updates)
    this.panelsStore.dispatch.updateManyPanels(selectedPanelUpdates)
    return
  }

  async updateString(stringId: string, changes: Partial<GridStringModel>) {
    // const project = await this.projectsFacade.selectedProject()
    const update: UpdateStr<GridStringModel> = {
      id: stringId,
      changes,
    }

    this.stringsStore.dispatch.update(update)

    // return this.eventFactory.action({ action: 'UPDATE_PANEL', data: { update } })
  }

  async delete(stringId: string) {
    this.stringsStore.dispatch.delete(stringId)
    return stringId
  }
}
