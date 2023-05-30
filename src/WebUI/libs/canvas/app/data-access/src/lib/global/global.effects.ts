/*
 const allStateActions = [
 ...getAllActions(AppStateActions),
 ...getAllActions(SelectedActions),
 ...getAllActions(UiActions),
 ...getAllActions(ObjectPositioningActions),
 ...getAllActions(GraphicsActions),
 ...getAllActions(KeysActions),
 ]
 export const renderCanvasOnStateChanges$ = createEffect(
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
