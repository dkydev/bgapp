import * as bcrypt from 'bcryptjs';
import * as Mongoose from 'mongoose';
import {Document, Schema, Model} from "mongoose";

export interface IUser extends Document {
    username: string;
    email: string,
    password: string,
    totalXP: number,
    leagues: IUserLeague[],

    comparePassword: (string) => boolean,
    //generateJWT: () => string;
};

export interface IUserView {
    username: string;
    email: string,
    totalXP: number,
    leagues: IUserLeague[]
}

export interface IUserModel extends Model<IUser> {
    view: (string) => IUser
}

export interface IUserLeague extends Document {
    isAdmin: boolean,
    leagueID: string,
    leagueXP: number
}

const userLeagueSchema: Schema = new Schema({

    isAdmin: {
        type: Boolean,
        default: false
    },

    leagueID: Schema.Types.ObjectId,

    leagueXP: {
        type: Number,
        min: 0,
        max: Number.MAX_SAFE_INTEGER
    }

}, {timestamps: true});

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

    totalXP: {
        type: Number,
        min: 0,
        max: Number.MAX_SAFE_INTEGER
    },

    leagues: [userLeagueSchema],

}, {timestamps: true});


userSchema.pre('save', function <IUser>(next) {

    if (!this.isModified('password')) return next();

    bcrypt.hash(this.password, 8).then((hash) => {
        this.password = hash;
        next();
    }).catch(next);

});

userSchema.statics.view = (id: string): Promise<IUserView> => {
    return new Promise((resolve, reject) => {
        model.findById(id, (err, user: IUser) => {
            if (err) return reject(err);
            if (!user) reject("User not found");

            let userView: IUserView = {
                username: user.username,
                email: user.email,
                totalXP: user.totalXP,
                leagues: user.leagues
            };
            resolve(userView);
        });
    });
};

userSchema.methods.comparePassword = function (candidatePassword: string): Promise<boolean> {
    let password = this.password;
    return new Promise((resolve, reject) => {
        bcrypt.compare(candidatePassword, password, (err, success) => {
            if (err) return reject(err);
            return resolve(success);
        });
    });
};

export const model: IUserModel = Mongoose.model<IUser, IUserModel>('User', userSchema);
export const schema = model.schema;