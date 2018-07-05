import {model as League, ILeague} from './model';
import {IUserLeague, model as UserLeague} from '../userleague/model';

export class LeagueController {

    public create = async (req, res) => {
        try {
            req.checkBody("name", "Name required").notEmpty();
            req.checkBody("description", "Description required").notEmpty();

            let errors = req.validationErrors();
            if (errors) throw errors;

            let league: ILeague = await new League({
                "name": req.body.name,
                "description": req.body.description,
            }).save();

            // Add user to new league.
            let userLeague:IUserLeague = await new UserLeague({
                user_id : req.body.user.id,
                league_id : league.id,
                is_admin : true,
                league_xp : 0
            }).save();

            res.status(200).json({id: league.id});
        } catch (err) {
            res.status(401).json({"message": "Invalid parameters.", "errors": err});
        }
    };

    public view = async (req, res) => {
        try {
            req.checkBody("id", "ID is required").notEmpty();

            let errors = req.validationErrors();
            if (errors) throw errors;

            let league: ILeague = await League.findById(req.body.id);

            res.status(200).json({league: league});
        } catch (err) {
            res.status(401).json({"message": "Invalid parameters.", "errors": err});
        }
    };

    public join = async (req, res) => {
    };

    public leave = async (req, res) => {
    };
}

export default new LeagueController();

