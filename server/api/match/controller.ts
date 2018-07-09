import {model as Match, IMatch} from './model';

export class MatchController {

    public create = async (req, res) => {
        try {
            req.checkBody("name", "Name is required.").notEmpty();
            req.checkBody("league_id", "League is required.").notEmpty();
            let errors = req.validationErrors();
            if (errors) throw errors;

            let match: IMatch = await Match.create({
                "name": req.body.name,
                "league_id": req.body.league_id
            });

            res.status(200).json({"message": `Created match playing ${match.name}.`});
        } catch (err) {
            res.status(400).json({"message": "Invalid parameters.", "errors": err});
        }
    };

    public view = async (req, res) => {
        try {
            req.checkParams("match_id", "Match ID is required.").notEmpty();
            let errors = req.validationErrors();
            if (errors) throw errors;

            let match: IMatch = await Match.findOne({_id: req.params.match_id}).populate("user_match");
            if (!match) {
                return res.status(400).json({"message": "Match not found."});
            }

            res.status(200).json({match: match});
        } catch (err) {
            res.status(400).json({"message": "Invalid parameters.", "errors": err});
        }
    };

    public update = async (req, res) => {
        try {
            req.checkParams("match_id", "Match ID is required.").notEmpty();
            let errors = req.validationErrors();
            if (errors) throw errors;

            let match: IMatch = await Match.findOne({_id: req.params.match_id});
            if (!match) {
                return res.status(400).json({"message": "Match not found."});
            }

            // TODO: Board game API stuff.

            // Rename match.
            if (req.body.name) {
                match.name = req.body.name;
            }

            // TODO: Push/pull user_matches.

            //if (req.body.name) match.user_match = req.body.name;

            await match.save();

            return res.status(200).json({"message": `Match updated.`});
        } catch (err) {
            return res.status(400).json({"message": "Error updating match.", "errors": err});
        }
    };

    public delete = async (req, res) => {
        try {
            req.checkParams("match_id", "Match ID is required.").notEmpty();
            let errors = req.validationErrors();
            if (errors) throw errors;

            let match: IMatch = await Match.findOne({code: req.params.match_id});
            if (!match) {
                return res.status(400).json({"message": "Match not found."});
            }

            await match.remove();

            res.status(200).json({"message": `Match deleted..`});
        } catch (err) {
            res.status(400).json({"message": "Error deleting match.", "errors": err});
        }
    };
}

export default new MatchController();

