import { model as User, IUser } from './model';
import auth from '../../common/auth';


export class UserController {

    public register = async () => {

    };

    public login = async (req, res) => {
        try {
            req.checkBody("username", "Invalid username").notEmpty();
            req.checkBody("password", "Invalid password").notEmpty();

            let errors = req.validationErrors();
            if (errors) throw errors;

            let user = await User.findOne({"username": req.body.username}).exec();

            if (user === null) throw "User not found";

            let success = await user.comparePassword(req.body.password);
            if (success === false) throw "";

            res.status(200).json(auth.genToken(user));
        } catch (err) {
            res.status(401).json({"message": "Invalid credentials", "errors": err});
        }
    };
}

export default new UserController();
