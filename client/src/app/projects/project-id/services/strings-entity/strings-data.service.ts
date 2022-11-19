import { DefaultDataService, HttpUrlGenerator } from '@ngrx/data'
import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs'
import { environment } from '../../../../../environments/environment'
import { map } from 'rxjs/operators'
import { Update } from '@ngrx/entity'
import { StringModel } from '../../../models/string.model'

interface GetStringsResponse {
  strings: StringModel[]
}

interface UpdateStringResponse {
  string: StringModel
}

interface CreateStringResponse {
  string: StringModel
}

interface DeleteStringResponse {
  string_id: number
}

@Injectable()
export class StringsDataService extends DefaultDataService<StringModel> {
  constructor(
    http: HttpClient,
    httpUrlGenerator: HttpUrlGenerator,
    // logger: Logger,
  ) {
    super('String', http, httpUrlGenerator)
    // logger.log('Created custom Strings EntityDataService')
  }

  override getAll(): Observable<StringModel[]> {
    return this.http
      .get<GetStringsResponse>(environment.apiUrl + `/projects/3/strings`)
      .pipe(map((res) => res.strings))
  }

  override add(entity: StringModel): Observable<StringModel> {
    return this.http
      .post<CreateStringResponse>(
        environment.apiUrl + `/projects/3/string`,
        entity,
      )
      .pipe(map((res) => res.string))
  }

  override update(update: Update<StringModel>): Observable<StringModel> {
    return this.http
      .put<UpdateStringResponse>(
        environment.apiUrl + `/projects/3/string/${update.id}`,
        update,
      )
      .pipe(map((res) => res.string))
  }

  override delete(key: number | string): Observable<number | string> {
    return this.http
      .delete<DeleteStringResponse>(
        environment.apiUrl + `/projects/3/string/${key}`,
      )
      .pipe(map((res) => res.string_id))
  }
}
