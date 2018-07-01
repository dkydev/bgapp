import {IUser, model as User} from "../api/user/model";
import * as jwt from "jwt-simple";
import * as passport from "passport";
import * as moment from "moment";
import {Strategy, ExtractJwt} from "passport-jwt";

class Auth {
    public initialize = () => {
        passport.use("jwt", this.getStrategy());
        return passport.initialize();
    };

    public authenticate = () => {
        return new Promise((resolve, reject) => {
            return passport.authenticate("jwt", {session: false, failWithError: true}, (err, user, info) => {
                if (err) {
                    reject(err);
                }
                if (!user) {
                    if (info.name === "TokenExpiredError") {
                        reject({message: "Your token has expired. Please generate a new one"});
                    } else {
                        reject({message: info.message});
                    }
                }
                resolve(user);
            });
        });
    }

    public genToken = (user: IUser): Object => {
        let expires = moment().utc().add({days: 7}).unix();
        let token = jwt.encode({
            exp: expires,
            username: user.username
        }, process.env.JWT_SECRET);

        return {
            token: "JWT " + token,
            expires: moment.unix(expires).format(),
            user: user._id
        };
    };

    private getStrategy = (): Strategy => {
        const params = {
            secretOrKey: process.env.JWT_SECRET,
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            passReqToCallback: true
        };

        return new Strategy(params, (payload: any, done) => {
            User.findOne({"username": payload.username}, (err, user) => {
                /* istanbul ignore next: passport response */
                if (err) {
                    return done(err);
                }
                /* istanbul ignore next: passport response */
                if (user === null) {
                    return done(null, false, {message: "The user in the token was not found"});
                }

                return done(null, {_id: user._id, username: user.username});
            });
        });
    };
}

export default new Auth();