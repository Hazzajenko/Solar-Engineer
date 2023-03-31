/*
 @Injectable()
 export class FreePanelsEffects {
 private actions$ = inject(Actions);

 init$ = createEffect(() => this.actions$.pipe(
 ofType(FreePanelsActions.initFreePanels),
 switchMap(() => of(FreePanelsActions.loadFreePanelsSuccess({ freePanels: [] }))),
 catchError((error) => {
 console.error('Error', error);
 return of(FreePanelsActions.loadFreePanelsFailure({ error }));
 }
 )
 ));
 }
 */
