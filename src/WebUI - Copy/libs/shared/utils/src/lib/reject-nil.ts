import { filter, OperatorFunction, pipe } from 'rxjs'

export function rejectNil<T>(): OperatorFunction<T, NonNullable<T>> {
  return pipe(filter((value): value is NonNullable<T> => value !== null && value !== undefined))
}

/*export function takeIdAndCombineLatest<T>(func: Function) {
// export function takeIdAndCombineLatest<T>(id: string, ...observables: Observable<T>[]) {
  return pipe(
    switchMap(
      ({ projectSignalrEvent }) =>
        combineLatest([
          of(projectSignalrEvent),
          this.signalrEventsFacade.selectSignalrEventByRequestId$(
            projectSignalrEvent.requestId,
          ),
        ]),
    ),
  )
  // return combineLatest([of(id), ...observables])
/!*  switchMap(
    ({ projectSignalrEvent }) =>
      combineLatest([
        of(projectSignalrEvent),
        this.signalrEventsFacade.selectSignalrEventByRequestId$(
          projectSignalrEvent.requestId,
        ),
      ]),
  ),*!/
}
*/
