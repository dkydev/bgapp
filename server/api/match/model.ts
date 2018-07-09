import * as Mongoose from 'mongoose';
import {Document, Schema, Model} from "mongoose";
import {IUserMatch} from "./user_match/model";

export interface IMatch extends Document {
    name: String,
    game_api_reference : String,
    user_match: IUserMatch | String,
    completed : boolean
}

export interface IMatchModel extends Model<IMatch> {
    //view: (string) => IUser
}


export const matchSchema: Schema = new Schema({

    league_id : {
        type: Schema.Types.ObjectId,
        ref: 'league',
        required: true
    },

    name: {
        type: String,
        required: true,
        trim: true,
        minlength: 1,
        maxlength: 128,
    },

    game_api_reference: {
        type: String
    },

    user_match: {
        type: Mongoose.Schema.Types.ObjectId,
        ref: "user_match"
    },

    completed: {
        type: Mongoose.Schema.Types.Boolean,
        default: false
    }

}, {timestamps: true});

export const model: IMatchModel = Mongoose.model<IMatch, IMatchModel>('league', matchSchema);
export const schema = model.schema;