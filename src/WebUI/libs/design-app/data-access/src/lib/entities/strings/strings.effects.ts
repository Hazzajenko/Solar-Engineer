/*
 import { Actions, createEffect, ofType } from '@ngrx/effects'
 import { inject } from '@angular/core'
 import { tap } from 'rxjs'
 import { getAllActions } from '@shared/utils'
 import { RenderService } from '../../render'
 import { StringsActions } from './strings.actions'

 export const renderCanvasOnStateChange$ = createEffect(
 (actions$ = inject(Actions), renderService = inject(RenderService)) => {
 return actions$.pipe(
 ofType(...getAllActions(StringsActions)),
 tap(() => {
 renderService.renderCanvasApp()
 }),
 )
 },
 { functional: true, dispatch: false },
 )
 */
