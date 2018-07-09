import * as express from 'express';
import MatchController from './controller';
import Auth from "../../common/auth";

export function router(app: express.Application): void {
    app.post(process.env.API_BASE + "matches", Auth.authenticate, MatchController.create);

    app.patch(process.env.API_BASE + "matches/:match_id", Auth.authenticate, MatchController.update);

    app.get(process.env.API_BASE + "matches/:match_id", Auth.authenticate, MatchController.view);

    app.delete(process.env.API_BASE + "matches/:match_id", Auth.authenticate, MatchController.delete);
};