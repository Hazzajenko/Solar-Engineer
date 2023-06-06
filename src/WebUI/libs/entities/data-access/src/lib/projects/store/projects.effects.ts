export const ProjectsEffects = []
/*
 export const createProject$ = createEffect(
 (actions$ = inject(Actions), projectsHttp = inject(ProjectsHttpService)) => {
 return actions$.pipe(
 ofType(ProjectsActions.createProjectHttp),
 switchMap((request) => projectsHttp.createProject(request)),
 catchError((error: Error) => {
 console.error(error.message)
 return EMPTY
 }),
 )
 },
 { functional: true, dispatch: false },
 )

 export const loadUserProjects$ = createEffect(
 (actions$ = inject(Actions), projectsHttp = inject(ProjectsHttpService)) => {
 return actions$.pipe(
 ofType(AuthActions.signInSuccess),
 switchMap(() => projectsHttp.getUserProjects()),
 map(({ projects }) => {
 return ProjectsActions.loadUserProjectsSuccess({ projects })
 }),
 catchError((error) => of(ProjectsActions.loadUserProjectsFailure({ error }))),
 )
 },
 { functional: true },
 )
 */
