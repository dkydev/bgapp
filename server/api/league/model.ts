import * as Mongoose from 'mongoose';
import {Document, Schema, Model} from "mongoose";
import {IUser, userSchema} from "../user/model";

export interface ILeague extends Document {
    name: string;
    description: string,
    users: IUser[]
};

export interface ILeagueModel extends Model<ILeague> {
    //view: (string) => IUser
}

export const leagueSchema: Schema = new Schema({

    name: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        minlength: 1,
        maxlength: 30,
    },

    description: {
        type: String,
        required: false,
        trim: true,
        minlength: 1,
        maxlength: 255,
    },

    users: [Schema.Types.ObjectId]

}, {timestamps: true});

export const model: ILeagueModel = Mongoose.model<ILeague, ILeagueModel>('League', leagueSchema);
export const schema = model.schema;