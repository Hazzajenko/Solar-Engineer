import { GridPanelModel, GridStringModel, PanelLinkModel } from '@shared/data-access/models'

export interface GetProjectDataResponse {
  id: string
  name: string
  createdTime: string
  createdById: string
  lastModifiedTime: string
  panels: GridPanelModel[]
  panelLinks: PanelLinkModel[]
  strings: GridStringModel[]
}

/*

 public string Id { get; set; } = default!;
 public DateTime CreatedTime { get; set; }
 public DateTime LastModifiedTime { get; set; }*/