import {model as League, ILeague, createLeague} from './model';
import {IUserLeague, model as UserLeague} from './user_league/model';

export class LeagueController {

    public create = async (req, res) => {
        try {
            req.checkBody("name", "Name required.").notEmpty();
            let errors = req.validationErrors();
            if (errors) throw errors;

            let league: ILeague = await createLeague(req.body.user.id, {
                "name": req.body.name,
                "description": req.body.description
            });

            res.status(200).json({"message": `Created league ${league.name}.`, league_id: league.id, code : league.code});
        } catch (err) {
            res.status(400).json({"message": "Invalid parameters.", "errors": err});
        }
    };

    public view = async (req, res) => {
        try {
            req.checkParams("league_id", "League ID is required.").notEmpty();
            let errors = req.validationErrors();
            if (errors) throw errors;

            let league: ILeague = await League.findOne({_id: req.params.league_id});

            res.status(200).json({league: league});
        } catch (err) {
            res.status(400).json({"message": "Invalid parameters.", "errors": err});
        }
    };

    public update = async (req, res) => {
        try {
            req.checkParams("league_id", "League ID is required.").notEmpty();
            let errors = req.validationErrors();
            if (errors) throw errors;

            let league: ILeague = await League.findOne({_id: req.params.league_id});
            if (!league) {
                return res.status(400).json({"message": "League not found."});
            }

            league.name = req.body.name ? req.body.name : league.name;
            league.description = req.body.description ? req.body.description : league.description;

            if (req.body.name || req.body.description) {
                await league.save();
            }

            return res.status(200).json({"message": `League updated.`});
        } catch (err) {
            return res.status(400).json({"message": "Error updating league.", "errors": err});
        }
    };

    public join = async (req, res) => {
        try {
            req.checkParams("code", "League code is required.").notEmpty();
            let errors = req.validationErrors();
            if (errors) throw errors;

            let league: ILeague = await League.findOne({code: req.params.code});
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
            req.checkParams("league_id", "League ID is required.").notEmpty();
            let errors = req.validationErrors();
            if (errors) throw errors;

            let league: ILeague = await League.findOne({_id: req.params.league_id});
            if (!league) {
                return res.status(400).json({"message": "League not found."});
            }

            let userLeague: IUserLeague = await UserLeague.findOne({user_id: req.body.user.id, league_id: league.id});
            if (!userLeague) {
                return res.status(400).json({"message": "Not a member."});
            }

            await userLeague.remove();

            res.status(200).json({"message": `You have left ${league.name}.`});
        } catch (err) {
            res.status(400).json({"message": "Error leaving league.", "errors": err});
        }
    };
}

export default new LeagueController();

