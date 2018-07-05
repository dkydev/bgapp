import * as Mongoose from 'mongoose';
import {Document, Schema, Model} from "mongoose";
import {IUserLeague} from "../userleague/model";
import * as shortid from 'shortid';

export interface ILeague extends Document {
    name: string;
    description: string,
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

export const model: ILeagueModel = Mongoose.model<ILeague, ILeagueModel>('league', leagueSchema);
export const schema = model.schema;