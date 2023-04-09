/*

 export {}
 declare module 'rxjs' {
 export class Observable<T> {
 toFirstValuePromise<U = T>(): Promise<U>
 }
 }

 Observable.prototype.toFirstValuePromise = function <T, U>(this: Observable<T>): Promise<U> {
 return firstValueFrom(this) as unknown as Promise<U>
 }*/
