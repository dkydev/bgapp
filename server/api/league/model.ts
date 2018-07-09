import * as Mongoose from 'mongoose';
import {Document, Schema, Model} from "mongoose";
import {IUserLeague, model as UserLeague} from "./user_league/model";
import * as shortid from 'shortid';
import {DocumentTimestamps} from "../../common/db";

// TODO: ShortID retries if fail.

export interface ILeague extends Document, DocumentTimestamps {
    name: string;
    description?: string,
    code: string,
    user_leagues: IUserLeague[]
}

export interface ILeagueModel extends Model<ILeague> {
    //view: (string) => IUser
}


export const leagueSchema: Schema = new Schema({

    name: {
        type: String,
        required: true,
        trim: true,
        minlength: 1,
        maxlength: 30,
    },

    code: {
        type: String,
        default: shortid.generate
    },

    description: {
        type: String,
        required: false,
        trim: true,
        minlength: 1,
        maxlength: 255,
    },

    user_leagues: [{
        type: Schema.Types.ObjectId,
        ref: 'user_league'
    }]

}, {timestamps: true});

export const createLeague = async (user_id: string, data: any): Promise<ILeague> => {

    let league: ILeague = await new model(data).save();

    // Add user to new league.
    await new UserLeague({
        user_id: user_id,
        league_id: league.id,
        is_admin: true,
        league_xp: 0
    }).save();

    return league;
};

export const model: ILeagueModel = Mongoose.model<ILeague, ILeagueModel>('league', leagueSchema);
export const schema = model.schema;