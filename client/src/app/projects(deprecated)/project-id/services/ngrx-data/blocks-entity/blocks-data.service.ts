import { DefaultDataService, HttpUrlGenerator } from '@ngrx/data'
import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs'
import { environment } from '../../../../../../environments/environment'
import { map } from 'rxjs/operators'
import { Update } from '@ngrx/entity'
import { BlockModel } from '../../../../models/block.model'

interface GetBlocksResponse {
  blocks: BlockModel[]
}

interface UpdateBlockResponse {
  block: BlockModel
}

interface CreateBlockResponse {
  block: BlockModel
}

interface DeleteBlockResponse {
  block_id: number
}

@Injectable()
export class BlocksDataService extends DefaultDataService<BlockModel> {
  constructor(http: HttpClient, httpUrlGenerator: HttpUrlGenerator) {
    super('Block', http, httpUrlGenerator)
  }

  override getAll(): Observable<BlockModel[]> {
    return this.http
      .get<GetBlocksResponse>(environment.apiUrl + `/projects/3/blocks`)
      .pipe(map((res) => res.blocks))
  }

  override add(entity: BlockModel): Observable<BlockModel> {
    return this.http
      .post<CreateBlockResponse>(
        environment.apiUrl + `/projects/3/block`,
        entity,
      )
      .pipe(map((res) => res.block))
  }

  override update(update: Update<BlockModel>): Observable<BlockModel> {
    return this.http
      .put<UpdateBlockResponse>(
        environment.apiUrl + `/projects/3/block/${update.id}`,
        update,
      )
      .pipe(map((res) => res.block))
  }

  override delete(key: number | string): Observable<number | string> {
    return this.http
      .delete<DeleteBlockResponse>(
        environment.apiUrl + `/projects/3/block/${key}`,
      )
      .pipe(map((res) => res.block_id))
  }
}
