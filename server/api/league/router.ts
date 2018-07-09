import * as express from 'express';
import LeagueController from './controller';
import Auth from "../../common/auth";

export function router(app: express.Application): void {
    app.post(process.env.API_BASE + "leagues", Auth.authenticate, LeagueController.create);

    app.get(process.env.API_BASE + "leagues/:league_id", Auth.authenticate, LeagueController.view);

    app.patch(process.env.API_BASE + "leagues/:league_id", Auth.authenticate, LeagueController.update);

    app.post(process.env.API_BASE + "leagues/:code/join", Auth.authenticate, LeagueController.join);

    app.post(process.env.API_BASE + "leagues/:league_id/leave", Auth.authenticate, LeagueController.leave);
};