import '../server/common/env';
import * as mongoose from "mongoose";
import {Mockgoose} from 'mockgoose';
import {dbURI, dbOptions} from '../server/common/db';
import "mocha";
import {IUser, model as User} from "../server/api/user/model";
import App from '../server/common/server';
import routes from '../server/routes';

process.env.NODE_ENV = "test";

// Mock in-memory database.
let mockgoose: Mockgoose = new Mockgoose(mongoose);
mockgoose.prepareStorage().then(() => {
    mongoose.connect(dbURI, dbOptions).then(() => {
        console.log('db connection is now open');
    });
}).catch(() => {
    console.log('something went wrong');
});

// Initialize our app without database.
var app: App = new App()
    .router(routes)
    .listen(parseInt(process.env.PORT));

export const request = require("supertest")(app.express);
export const chai = require("chai");
export const should = chai.should();

//
//
//

const testUser = {"username": "testuser", "password": "mytestpass"};

const createUser = async (): Promise<void> => {
    const UserModel = new User(testUser);
    await UserModel.save();
};

const getUser = async (): Promise<IUser> => {
    let users = await User.find({});
    if (users.length === 0) {
        await createUser();
        return getUser();
    } else {
        return users[0];
    }
};

export const login = async (): Promise<any> => {
    let user = await getUser();
    return request.post(process.env.API_BASE + "login")
        .send({"username": user.username, "password": testUser.password})
        .expect(200);
};