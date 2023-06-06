/*export const renderCanvasOnStateChange$ = createEffect(
 (actions$ = inject(Actions), renderService = inject(RenderService)) => {
 return actions$.pipe(
 ofType(...allSelectedActions),
 tap(() => {
 renderService.renderCanvasApp()
 }),
 )
 },
 { functional: true, dispatch: false },
 )*/

/*
 export const selectStringNotification$ = createEffect(
 (actions$ = inject(Actions), stringsStore = injectStringsStore()) => {
 return actions$.pipe(
 ofType(SelectedActions.selectString),
 map(({ stringId }) => {
 const string = stringsStore.select.getById(stringId)
 assertNotNull(string)
 const notification: ActionNotificationModel = {
 title: `${string.name} selected`,
 duration: 3000,
 type: 'info',
 id: `selected-string-${getGuid()}`,
 isOpen: true,
 buttons: [
 {
 text: 'Undo',
 action: () => {
 console.log('undo')
 },
 },
 ],
 }
 return NotificationsActions.addNotification({ notification })
 }),
 )
 },
 { functional: true },
 )
 */

/*
 export const SelectedEffects = {
 renderCanvasOnStateChange$,
 selectStringNotification$,
 }*/
