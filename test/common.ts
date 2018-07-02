import '../server/common/env';
import "mocha";
import {IUser, model as User} from "../server/api/user/model";
import App from '../server/common/server';
import routes from '../server/routes';

process.env.NODE_ENV = "test";

// Initialize our app without database.
var app: App = new App()
    .initDB("bgl-test")
    .router(routes)
    .listen(parseInt(process.env.PORT));

export const request = require("supertest")(app.express);
export const chai = require("chai");
export const should = chai.should();

//
//
//

const testUser = {"username": "testuser", "password": "mytestpass"};

let testToken:string;

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
    let result = await request.post(process.env.API_BASE + "login")
        .send({"username": user.username, "password": testUser.password})
        .expect(200);

    testToken = result.body.token;

    return result;
};

export const getToken = ():string => {
    if (testToken == null) {
        throw "Token does not exist. Must login first.";
    }
    return testToken;
};