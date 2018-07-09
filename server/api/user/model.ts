import * as bcrypt from 'bcryptjs';
import * as Mongoose from 'mongoose';
import {Document, Schema, Model} from "mongoose";
import {IUserLeague, model as UserLeague} from "../league/user_league/model";
import {testUser} from "../../../test/common";
import {DocumentTimestamps} from "../../common/db";

export interface IUser extends Document, DocumentTimestamps {
    username: string;
    email: string,
    password: string,
    total_xp: number,

    comparePassword: (string) => boolean,
    //generateJWT: () => string;
};

export interface IUserView {
    username: string;
    email: string,
    total_xp: number,
    user_leagues: IUserLeague[]
}

export interface IUserModel extends Model<IUser> {
    view: (string) => IUserView
}

export const userSchema: Schema = new Schema({

    email: {
        type: String,
        match: /^\S+@\S+\.\S+$/,
        required: false,
        unique: true,
        sparse: true, // Allow null or unique.
        trim: true,
        lowercase: true,
        minlength: 3,
        maxlength: 255,
    },

    password: {
        type: String,
        required: false,
        minlength: 6,
        maxlength: 30,
        trim: true,
    },

    username: {
        type: String,
        unique: true,
        index: true,
        trim: true,
        minlength: 1,
        maxlength: 30,
    },

    total_xp: {
        type: Schema.Types.Number,
        min: 0,
        max: Number.MAX_SAFE_INTEGER
    }

}, {timestamps: true});


userSchema.pre('save', function <IUser>(next) {

    if (!this.isModified('password')) return next();

    bcrypt.hash(this.password, 8).then((hash) => {
        this.password = hash;
        next();
    }).catch(next);

});

userSchema.statics.view = async (id: string): Promise<IUserView> => {

    let user: IUser = await model.findById(id);
    let userView: IUserView = {
        username: user.username,
        email: user.email,
        total_xp: user.total_xp,
        user_leagues: await UserLeague.find({user_id: user.id}).populate("league_id")
    };

    return userView;
};

userSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
    let password = this.password;
    return new Promise<boolean>((resolve, reject) => {
        bcrypt.compare(candidatePassword, password, (err, success) => {
            if (err) return reject(err);
            return resolve(success);
        });
    });
};

export const createUser = async (data: any): Promise<IUser> => {
    return await new model(data).save();
};

export const model: IUserModel = Mongoose.model<IUser, IUserModel>('user', userSchema);
export const schema = model.schema;