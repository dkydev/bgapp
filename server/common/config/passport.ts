import { Strategy, ExtractJwt } from 'passport-jwt';
import { Passport } from "passport";

import * as UserModel from '../../api/controllers/user/model';

export class PassportConfig {

    public passport: Passport;

    constructor(passport: any){
        this.passport = passport;
    }

    public init() {
        let opts = {
            jwtFromRequest: ExtractJwt.fromAuthHeader(),
            secretOrKey: process.env.APPLICATION_SECRET
        };

        this.passport.use(new Strategy(opts, (jwtPayload, done) => {
            UserModel.findOne({_id: jwtPayload._doc._id}, (err, user) => {
                if (err) {
                    return done(err, false);
                } else if (user) {
                    return done(null, user);
                } else {
                    return done(null, false);
                }
            });
        }));
    }
}
