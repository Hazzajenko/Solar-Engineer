/*
 export const setItem = <T>(key: string, item: T): void => {
 localStorage.setItem(key, JSON.stringify(item));
 }

 export const getItem = <T>(key: string): T => {
 let data: any = localStorage.getItem(key);
 if (!data) return null;

 let obj: T;

 try {
 obj = <T>JSON.parse(data);
 } catch  (error) {
 obj = null;
 }

 return obj
 }*/
