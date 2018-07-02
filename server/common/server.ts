import * as express from 'express';
import * as path from 'path';
import * as bodyParser from 'body-parser';
import * as http from 'http';
import * as os from 'os';
//import * as cookieParser from 'cookie-parser';
import swaggerify from './swagger';
import log from './logger';
import {dbInit} from "./db";
import auth from './auth';
import * as expressValidator from 'express-validator';

export default class App {

    public readonly express: express.Application;

    constructor() {
        const root = path.normalize(__dirname + '/../..');

        this.express = express();
        //this.app.set('appPath', root + 'client');
        this.express.use(bodyParser.json());
        this.express.use(bodyParser.urlencoded({extended: true}));

        this.express.use(expressValidator());
        //this.app.use(cookieParser(process.env.SESSION_SECRET));

        // Serve /public directory.
        this.express.use(express.static(`${root}/public`));

        // Init authentication strategy.
        this.express.use(auth.initialize());

    }

    public initDB(dbName:string): App {
        dbInit(dbName);
        return this;
    }

    public router(router: (app: express.Application) => void): App {
        router(this.express);
        //swaggerify(this.express, router);
        return this;
    }

    public listen(port: number = parseInt(process.env.PORT)): App {
        const welcome = port => () =>
            log.info(`up and running in ${process.env.NODE_ENV || 'development'} @: ${os.hostname() } on port: ${port}}`);
        http.createServer(this.express).listen(port, welcome(port));
        return this;
    }
}