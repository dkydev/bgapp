import {model as User, IUser, IUserView} from './model';
import auth from '../../common/auth';
import {testUser} from "../../../test/common";


export class UserController {

    public register = async (req, res) => {
        try {
            req.checkBody("username", "Username required").notEmpty();
            req.checkBody("password", "Password required").notEmpty();

            let errors = req.validationErrors();
            if (errors) throw errors;

            let user: IUser = await new User({
                "username": req.body.username,
                "password": req.body.password,
                "email": req.body.email,
            }).save();

            res.status(200).json(auth.genToken(user));
        } catch (err) {
            res.status(400).json({"message": "Invalid parameters.", "errors": err});
        }
    };

    public login = async (req, res) => {
        try {
            req.checkBody("username", "Invalid username").notEmpty();
            req.checkBody("password", "Invalid password").notEmpty();

            let errors = req.validationErrors();
            if (errors) throw errors;

            let user = await User.findOne({"username": req.body.username}).exec();

            if (user === null) throw "User not found.";

            let success = await user.comparePassword(req.body.password);
            if (success === false) throw "";

            res.status(200).json(auth.genToken(user));
        } catch (err) {
            res.status(400).json({"message": "Invalid credentials.", "errors": err});
        }
    };

    public view = async (req, res) => {
        try {
            let user: IUserView = await User.view(req.body.user.id);
            res.status(200).json({user: user});
        } catch (err) {
            res.status(400).json({"message": "User not found.", "errors": err});
        }
    };
}

export default new UserController();
