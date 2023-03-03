import { PanelLinkModel, PanelModel, StringModel } from '@shared/data-access/models'

export interface GetProjectDataResponse {
  id: string
  name: string
  createdTime: string
  createdById: string
  lastModifiedTime: string
  panels: PanelModel[]
  panelLinks: PanelLinkModel[]
  strings: StringModel[]
}

/*

public string Id { get; set; } = default!;
public DateTime CreatedTime { get; set; }
public DateTime LastModifiedTime { get; set; }*/
