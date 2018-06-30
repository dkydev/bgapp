import * as pino from 'pino';

const log = pino({
  name: process.env.APP_ID,
  level: process.env.LOG_LEVEL,
});

export default log;
