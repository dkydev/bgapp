import {Application} from 'express';
import {router as userRouter} from './api/user/router';
import {router as leagueRouter} from './api/league/router';

export default function routes(app: Application): void {
    userRouter(app);
    leagueRouter(app);
};