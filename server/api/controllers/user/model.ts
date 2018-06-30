import bcrypt from 'bcryptjs';
import * as Mongoose from 'mongoose';
import {Document, Schema} from "mongoose";

export interface IUser extends Document {
    username: string;
    email: string,
    password: string,
    totalXP: number,
    leagues: IUserLeague[],


    //generateJWT: () => string;
};

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

const userSchema: Schema = new Schema({

    email: {
        type: String,
        match: /^\S+@\S+\.\S+$/,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },

    password: {
        type: String,
        required: false,
        minlength: 6,
        maxlength: 30,
    },

    username: {
        type: String,
        index: true,
        trim: true
    },

    totalXP: {
        type: Number,
        min: 0,
        max: Number.MAX_SAFE_INTEGER
    },

    leagues: [userLeagueSchema],

}, {timestamps: true});


userSchema.pre('save', next => {

    if (!this.isModified('password')) return next();

    bcrypt.hash(this.password, 8).then((hash) => {
        this.password = hash;
        next();
    }).catch(next);

});

userSchema.methods.view = function (id: string): IUser {
    return this.findById(id);
};

userSchema.methods.authenticate = function (password): boolean {
    return bcrypt.compare(password, this.password).then((valid) => valid ? this : false)
};

const model = Mongoose.model<IUser>('User', userSchema);

export const schema = model.schema;
export default model;
