import { LogLevel } from './log-level'

export type LogOutput = (source: string | undefined, level: LogLevel, ...objects: any[]) => void;