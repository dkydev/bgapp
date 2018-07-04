import {request, login, getToken, testUser, deleteUser, createUser} from "./common";
import {expect} from "chai";

//beforeEach(async function() {
//});

describe("# User", () => {

    it("should register a user", async () => {

        const testRegisterUser = {
            username: "registerTestUsername",
            email: "test-email@hotmail.com",
            password: "testPassword"
        };

        // Delete user if re-test.
        await deleteUser(testRegisterUser.username);

        // Register.
        let res = await request.post(process.env.API_BASE + "register").send(testRegisterUser).expect(200);

        expect(res.body).to.not.be.empty;
    });

    it("should fail to register a user", async () => {

        const noData = {};

        // Register.
        let res = await request.post(process.env.API_BASE + "register").send(noData).expect(401);
    });

    it("should view a user", async () => {
        let token: string = await login();
        let res = await request.post(process.env.API_BASE + "view").set('Authorization', 'Bearer ' + token).expect(200);

        // Should have a user object.
        expect(res.body.user).to.not.be.empty;

        // Username is the test username.
        expect(res.body.user.username).to.equal(testUser.username);

        // Password should not be returned.
        expect(res.body.user.password).to.be.undefined;
    });

});