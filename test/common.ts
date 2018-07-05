import '../server/common/env';
import "mocha";
import {IUser, model as User} from "../server/api/user/model";
import App from '../server/common/server';
import routes from '../server/routes';

process.env.NODE_ENV = "test";
process.env.DB_NAME = "bgl-test";

// Initialize our app without database.
var app: App = new App()
    .initDB()
    .router(routes)
    .listen(parseInt(process.env.PORT));

export const request = require("supertest")(app.express);
export const chai = require("chai");
export const should = chai.should();

//
//
//

before(async () => {
});

after(async () => {
    await app.stopListening();
    await app.closeDB();
});

//
//
//

export const testUser = {"username": "testuser", "password": "mytestpass"};

let testToken: string;
let userId: string;

export const createTestUser = async (): Promise<void> => {
    const UserModel = new User(testUser);
    let user: IUser = await UserModel.save();
    userId = user.id;
};

export const getTestUser = async (): Promise<IUser> => {
    let users = await User.find({"username": testUser.username});
    if (users.length === 0) {
        await createTestUser();
        return getTestUser();
    } else {
        return users[0];
    }
};

export const login = async (): Promise<any> => {
    let user = await getTestUser();
    let result = await request
        .post(process.env.API_BASE + "login")
        .send({"username": user.username, "password": testUser.password})
        .expect(200);
    testToken = result.body.token;
    return testToken;
};

export const getTestUserToken = (): string => {
    if (testToken == null) {
        throw "Token does not exist. Must login first.";
    }
    return testToken;
};