import { Injectable } from '@angular/core'
import { ComponentStore } from '@ngrx/component-store'

export interface GridState {}

@Injectable()
export class GridStore extends ComponentStore<GridState> {}
