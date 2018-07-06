import * as express from 'express';
import LeagueController from './controller';
import Auth from "../../common/auth";

export function router(app: express.Application): void {
    app.post(process.env.API_BASE + "league", Auth.authenticate, LeagueController.create);

    app.get(process.env.API_BASE + "league", Auth.authenticate, LeagueController.view);

    app.post(process.env.API_BASE + "join", Auth.authenticate, LeagueController.join);

    app.post(process.env.API_BASE + "leave", Auth.authenticate, LeagueController.leave);
};