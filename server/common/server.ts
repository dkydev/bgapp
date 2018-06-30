import * as express from 'express';
import {Application} from 'express';
import * as path from 'path';
import * as bodyParser from 'body-parser';
import * as http from 'http';
import * as os from 'os';
import * as cookieParser from 'cookie-parser';
import swaggerify from './swagger';
import log from './logger';
import * as mongoose from 'mongoose';

import * as passport from 'passport';
import {PassportConfig} from './config/passport';

export default class App {

    private app: express.Application;

    constructor() {
        const root = path.normalize(__dirname + '/../..');

        this.app = express();
        this.app.set('appPath', root + 'client');
        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({extended: true}));
        this.app.use(cookieParser(process.env.SESSION_SECRET));
        this.app.use(express.static(`${root}/public`));

        mongoose.connect(process.env.MONGODB_URI || process.env.MONGOLAB_URI);
        mongoose.connection.on('error', () => {
            console.log('MongoDB connection error. Please make sure MongoDB is running.');
            process.exit();
        });

    }

    public router(router: (app: express.Application) => void): express.Application {
        swaggerify(this.app, router);
        return this.app;
    }

    public listen(port: number = parseInt(process.env.PORT)): express.Application {
        const welcome = port => () => log.info(`up and running in ${process.env.NODE_ENV || 'development'} @: ${os.hostname() } on port: ${port}}`);
        http.createServer(this.app).listen(port, welcome(port));
        return this.app;
    }
}