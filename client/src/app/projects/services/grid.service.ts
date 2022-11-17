import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Store } from '@ngrx/store'
import { AppState } from '../../store/app.state'
import { CdkDrag } from '@angular/cdk/drag-drop'
import { PanelModel } from '../models/panel.model'
import { selectPanelsByProjectId } from '../store/panels/panels.selectors'
import { environment } from '../../../environments/environment'
import { CableModel } from '../models/cable.model'
import { CableStateActions } from '../store/cable/cable.actions'

interface CreateCableResponse {
  cable: CableModel
}

@Injectable({
  providedIn: 'root',
})
export class GridService {
  gridNumbers: number[] = []

  constructor(private http: HttpClient, private store: Store<AppState>) {}

  numSequence(n: number): Array<number> {
    return Array(n)
  }

  stringSequence(n: number): Array<string> {
    return Array(n)
  }

  createCableForGrid(
    projectId: number,
    location: string,
    size: number,
  ): Promise<CreateCableResponse> {
    return new Promise<CreateCableResponse>((resolve, reject) =>
      this.http
        .post<CreateCableResponse>(
          `${environment.apiUrl}/projects/${projectId}/cables`,
          {
            location,
            size,
          },
        )
        .subscribe({
          next: (envelope) => {
            this.store.dispatch(
              CableStateActions.addCableToState({ cable: envelope.cable }),
            )
            // this.store.dispatch(updateString({ string: envelope.string }));
            resolve(envelope)
          },
          error: (err) => {
            reject(err)
          },
          complete: () => {
            console.log('createCableForGrid')
          },
        }),
    )
  }

  getNumbers(n: number): string[] {
    const array = this.stringSequence(n)

    for (let i = 0; i < n; i++) {
      if (i < 10) {
        array.push(`0${i}`)
      } else {
        array.push(`${i}`)
      }
    }
    return array
  }

  isSpotFreePredicate(item: CdkDrag<PanelModel>): boolean {
    if (item) {
      // console.log(item.dropContainer.id)
      this.store
        .select(
          selectPanelsByProjectId({
            projectId: 3,
          }),
        )
        .subscribe((panels) => {
          const spotTaken = panels.find(
            (panel) => panel.location === item.dropContainer.id,
          )
          return !spotTaken
        })
      return false
    }
    return false
  }
}
