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

    public authenticate = async (req, res, next) => {
        return await passport.authenticate('jwt', function (err, user, info) {
            if (err || !user) return res.status(401).json({message: "Authorization is required."});
            return next();
        })(req, res, next);

        /*
        await passport.authenticate("jwt", function (err, user, info) {
            if (err)
            if (!user)
            req.body.user = user;
        })(req, res, next);
        */
    }

    public genToken = (user: IUser): Object => {
        let expires = moment().utc().add({days: 7}).unix();
        let token = jwt.encode({
            exp: expires,
            user: {
                _id: user._id,
                username: user.username
            }
        }, process.env.JWT_SECRET);

        return {
            token: token,
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

        return new Strategy(params, (request, payload: any, done) => {
            User.findOne({"_id": payload.user._id}, (err, user) => {
                /* istanbul ignore next: passport response */
                if (err) {
                    return done(err);
                }
                /* istanbul ignore next: passport response */
                if (user === null) {
                    return done(null, false, {message: "The user in the token was not found"});
                }

                request.body.user = user;

                return done(null, {user: user});
            });
        });
    };
}

export default new Auth();