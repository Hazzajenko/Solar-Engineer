import { DefaultDataService, HttpUrlGenerator } from '@ngrx/data'
import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'
import { Update } from '@ngrx/entity'
import { LinkModel } from '../../../../models/link.model'

interface GetLinksResponse {
  links: LinkModel[]
}

interface UpdateLinkResponse {
  link: LinkModel
}

interface CreateLinkResponse {
  link: LinkModel
}

interface DeleteLinkResponse {
  link_id: number
}

@Injectable()
export class LinksDataService extends DefaultDataService<LinkModel> {
  constructor(http: HttpClient, httpUrlGenerator: HttpUrlGenerator) {
    super('Link', http, httpUrlGenerator)
  }

  override getAll(): Observable<LinkModel[]> {
    return this.http
      .get<GetLinksResponse>(`/api/projects/3/links`)
      .pipe(map((res) => res.links))
  }

  override add(entity: LinkModel): Observable<LinkModel> {
    return this.http
      .post<CreateLinkResponse>(`/api/projects/3/link`, entity)
      .pipe(map((res) => res.link))
  }

  override update(update: Update<LinkModel>): Observable<LinkModel> {
    console.log(update)
    return this.http
      .put<UpdateLinkResponse>(`/api/projects/3/link/${update.id}`, update)
      .pipe(map((res) => res.link))
  }

  override delete(key: number | string): Observable<number | string> {
    return this.http
      .delete<DeleteLinkResponse>(`/api/projects/3/link/${key}`)
      .pipe(map((res) => res.link_id))
  }
}
