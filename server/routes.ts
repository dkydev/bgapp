import {Application} from 'express';
import {router as userRouter} from './api/user/router';

export default function routes(app: Application): void {
    userRouter(app);
};