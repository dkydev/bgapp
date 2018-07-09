import * as Mongoose from 'mongoose';
import {Document, Schema, Model} from "mongoose";
import {model as User, IUser} from "../../user/model";

export interface IUserMatch extends Document {
    user_id: IUser | string,
    score: number,
}

export interface IUserMatchModel extends Model<IUserMatch> {
    //view: (string) => IUser
}

export const userMatchSchema: Schema = new Schema({

    user_id: {
        type: Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },

    score: {
        type: Schema.Types.Number,
        default: 0
    }

}, {timestamps: true});

export const model: IUserMatchModel = Mongoose.model<IUserMatch, IUserMatchModel>('user_league', userMatchSchema);
export const schema = model.schema;