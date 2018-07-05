import * as Mongoose from 'mongoose';
import {Document, Schema, Model} from "mongoose";
import {model as User} from "../user/model";
import {model as League} from "../league/model";

export interface IUserLeague extends Document {
    isAdmin: boolean,
    leagueID: string,
    leagueXP: number
}

export interface IUserLeagueModel extends Model<IUserLeague> {
    //view: (string) => IUser
}

export const userLeagueSchema: Schema = new Schema({

    isAdmin: {
        type: Boolean,
        default: false
    },

    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

    league: {
        type: Schema.Types.ObjectId,
        ref: 'League',
        required: true
    },

    leagueXP: {
        type: Number,
        min: 0,
        max: Number.MAX_SAFE_INTEGER
    }

}, {timestamps: true});


userLeagueSchema.post('save', async function <IUserLeague>() {

    await Promise.all([
        User.findByIdAndUpdate(this.user, {$push: {leagues: this.id}}),
        League.findByIdAndUpdate(this.league, {$push: {users: this.id}}),
    ]);

});

userLeagueSchema.post('remove', async function <IUserLeague>() {

    await Promise.all([
        User.findByIdAndUpdate(this.user, {$pull: {leagues: this.id}}),
        League.findByIdAndUpdate(this.league, {$pull: {users: this.id}}),
    ]);

});

export const model: IUserLeagueModel = Mongoose.model<IUserLeague, IUserLeagueModel>('UserLeague', userLeagueSchema);
export const schema = model.schema;