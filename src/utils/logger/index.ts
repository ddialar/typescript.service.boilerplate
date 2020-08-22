import bunyan from 'bunyan';
import { name } from '@package';

/*
 *  LEVEL HIEARCHY
 *  disable: > 60
 *  fatal  :60
 *  error  :50 -- logs everythig above
 *  warn   :40 -- logs everythig above
 *  info   :30 -- logs everythig above
 *  debug  :20 -- logs everythig above
 *  trace  :10 -- logs everythig above
 */

const { NODE_ENV } = process.env;

const logginLevels = {
    production: 30,
    development: 10,
    test: 100,
    default: 40,
};

export const getLogginLevel = (environment?: string) => {
    const data = Object.entries(logginLevels).reduce((result, [key, value]) => {
        result = key === environment ? value : result;
        return result;
    }, logginLevels.default) as number;

    return data;
};

export const logger = bunyan.createLogger({ name, level: getLogginLevel(NODE_ENV) });
