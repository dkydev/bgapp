import '../server/common/env';
import "mocha";
import {IUser, model as User, createUser} from "../server/api/user/model";
import App from '../server/common/server';
import routes from '../server/routes';

process.env.NODE_ENV = "test";
process.env.DB_NAME = "bgl-test";

// Initialize our app for testing.
var app: App = new App()
    .initDB()
    .router(routes)
    .listen(parseInt(process.env.PORT));

export const request = require("supertest")(app.express);
export const chai = require("chai");
export const should = chai.should();

//
// Test hooks.
//

before(async () => {
    await User.remove({});
});

after(async () => {
    await app.stopListening();
    await app.closeDB();
});

//
// Test helpers.
//

export const testUser = {"username": "testuser", "password": "mytestpass"};

export const getTestUser = async (): Promise<IUser> => {
    let user: IUser = await User.findOne({"username": testUser.username});
    if (!user) {
        return await createUser(testUser);
    } else {
        return user;
    }
};

export const login = async (): Promise<any> => {
    let user: IUser = await getTestUser();
    let result = await request
        .post(process.env.API_BASE + "users/login")
        .send({"username": user.username, "password": testUser.password})
        .expect(200);
    return result.body.token;
};