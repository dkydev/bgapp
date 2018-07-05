import * as Mongoose from 'mongoose';
import {Document, Schema, Model} from "mongoose";
import {model as User, IUser} from "../user/model";
import {model as League, ILeague} from "../league/model";

export interface IUserLeague extends Document {
    user_id: IUser | string,
    league_id: ILeague | string,
    is_admin: boolean,
    league_xp: number
}

export interface IUserLeagueModel extends Model<IUserLeague> {
    //view: (string) => IUser
}

export const userLeagueSchema: Schema = new Schema({

    is_admin: {
        type: Boolean,
        default: false
    },

    user_id: {
        type: Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },

    league_id: {
        type: Schema.Types.ObjectId,
        ref: 'league',
        required: true
    },

    league_xp: {
        type: Number,
        min: 0,
        max: Number.MAX_SAFE_INTEGER
    }

}, {timestamps: true});


userLeagueSchema.post('save', async function <IUserLeague>() {

    await Promise.all([
        League.findByIdAndUpdate(this.league_id, {$push: {user_leagues: this.id}}),
    ]);

});

userLeagueSchema.post('remove', async function <IUserLeague>() {

    await Promise.all([
        League.findByIdAndUpdate(this.league_id, {$pull: {user_leagues: this.id}}),
    ]);

});

export const model: IUserLeagueModel = Mongoose.model<IUserLeague, IUserLeagueModel>('user_league', userLeagueSchema);
export const schema = model.schema;