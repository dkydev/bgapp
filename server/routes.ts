import { Application } from 'express';
import {router as userRouter} from './api/user/router';
import auth from "./common/auth";

export default function routes(app: Application): void {
    userRouter(app);



    app.all(process.env.API_BASE + "*", (req, res, next) => {
        if (req.path.includes(process.env.API_BASE + "login")) return next();


    });

};