import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Store } from '@ngrx/store'
import { AppState } from '../../store/app.state'
import { CdkDrag } from '@angular/cdk/drag-drop'
import { PanelModel } from '../models/panel.model'
import { selectPanelsByProjectId } from '../store/panels/panels.selectors'

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

  getNumbers(n: number): string[] {
    const array = this.stringSequence(n)

    for (let i = 0; i < n; i++) {
      if (i < 10) {
        array.push(`0${i}`)
      } else {
        array.push(`${i}`)
      }
    }
    // let counter = 0
    /*    array.forEach((numb) => {
          if (counter < 10) {
            array.push(`0${counter}`)
          } else {
            array.push(`${counter}`)
          }
          counter++
        })*/
    /*    for (let entry of array) {
          if (counter < 10) {
            array.push(`0${counter}`)
          } else {
            array.push(`${counter}`)
          }
          counter++
        }*/
    console.log(array)
    return array
    // array.forEach((number) => {})
  }

  isSpotFreePredicate(item: CdkDrag<PanelModel>): boolean {
    if (item) {
      console.log(item.dropContainer.id)
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
