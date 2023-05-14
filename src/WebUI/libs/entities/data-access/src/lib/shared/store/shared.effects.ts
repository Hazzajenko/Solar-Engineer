/*
 import { Actions, createEffect, ofType } from '@ngrx/effects'
 import { inject } from '@angular/core'
 import { RenderService } from '@canvas/rendering/data-access'
 import { tap } from 'rxjs'
 import { getAllActions } from '@shared/utils'
 import { PanelLinksActions } from '../../panel-links'
 import { PanelConfigsActions } from '../../panel-configs'
 import { StringsActions } from '../../strings'
 import { PanelsActions } from '../../panels'

 const allStateActions = [
 ...getAllActions(StringsActions),
 ...getAllActions(PanelsActions),
 ...getAllActions(PanelLinksActions),
 ...getAllActions(PanelConfigsActions),
 ]
 export const renderCanvasOnEntityStateChanges$ = createEffect(
 (actions$ = inject(Actions), renderService = inject(RenderService)) => {
 return actions$.pipe(
 ofType(...allStateActions),
 tap(() => {
 renderService.renderCanvasApp()
 }),
 )
 },
 { functional: true, dispatch: false },
 )
 */
