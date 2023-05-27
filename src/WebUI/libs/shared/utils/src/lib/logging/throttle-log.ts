import { throttle } from 'lodash'
// import { source } from '@angular-devkit/schematics'

export const throttleLog = throttle((...args: any[]) => console.log(...args), 1000)
export const throttleLogV2 = (func: (...args: unknown[]) => void, ...objects: unknown[]) =>
	throttle(() => {
		const source = new Error().stack?.split('\n')[1].trim().split(' ')[1]
		const log = source ? ['[' + source + ']'].concat(objects as never) : objects
		func.apply(console, log)
		// return throttle(func.apply(console, objects), 1000)
	}, 1000)

/*
 private log(
 func: (...args: unknown[]) => void,
 level: LogLevel,
 source: string,
 objects: unknown[],
 ) {
 if (level <= LoggerService.level) {
 const log = source ? ['[' + source + ']'].concat(objects as never) : objects
 func.apply(console, log)
 LoggerService.outputs.forEach((output) => output.apply(output, [source, level, ...objects]))
 }
 }*/
