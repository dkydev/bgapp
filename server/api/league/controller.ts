import {model as League, ILeague, createLeague} from './model';
import {IUserLeague, model as UserLeague} from '../userleague/model';

export class LeagueController {

    public create = async (req, res) => {
        try {
            req.checkBody("name", "Name required.").notEmpty();
            req.checkBody("description", "Description required.").notEmpty();
            let errors = req.validationErrors();
            if (errors) throw errors;

            let league: ILeague = await createLeague(req.body.user.id, {
                "name": req.body.name,
                "description": req.body.description
            });

            res.status(200).json({"message": `Created league ${league.name}.`});
        } catch (err) {
            res.status(400).json({"message": "Invalid parameters.", "errors": err});
        }
    };

    public view = async (req, res) => {
        try {
            req.checkBody("code", "League code is required.").notEmpty();
            let errors = req.validationErrors();
            if (errors) throw errors;

            let league: ILeague = await League.findOne({code: req.body.code});

            res.status(200).json({league: league});
        } catch (err) {
            res.status(400).json({"message": "Invalid parameters.", "errors": err});
        }
    };

    public join = async (req, res) => {
        try {
            req.checkBody("code", "League code is required.").notEmpty();
            let errors = req.validationErrors();
            if (errors) throw errors;

            let league: ILeague = await League.findOne({code: req.body.code});
            if (!league) {
                return res.status(400).json({"message": "League not found."});
            }

            let userLeague: IUserLeague = await UserLeague.findOne({user_id: req.body.user.id, league_id: league.id});
            if (userLeague) {
                return res.status(400).json({"message": "Already a member."});
            }

            // Add user to league.
            let newUserLeague: IUserLeague = await new UserLeague({
                user_id: req.body.user.id,
                league_id: league.id,
                is_admin: false,
                league_xp: 0
            }).save();

            return res.status(200).json({"message": `You have joined ${league.name}.`});
        } catch (err) {
            return res.status(400).json({"message": "Error joining league.", "errors": err});
        }
    };

    public leave = async (req, res) => {
        try {
            req.checkBody("code", "League code is required.").notEmpty();
            let errors = req.validationErrors();
            if (errors) throw errors;

            let league: ILeague = await League.findOne({code: req.body.code});
            if (!league) {
                res.status(400).json({"message": "League not found."});
            }

            res.status(200).json({"message": `You have left ${league.name}.`});
        } catch (err) {
            res.status(400).json({"message": "Error leaving league.", "errors": err});
        }
    };
}

export default new LeagueController();

