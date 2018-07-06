import {request, login, testUser} from "../common";
import {expect} from "chai";
import {model as User} from "../../server/api/user/model";

describe("# User", () => {

    it("should register a user", async () => {

        const testRegisterUser = {
            username: "registerTestUsername",
            email: "test-email@hotmail.com",
            password: "testPassword"
        };

        // Clean up user_leagues if re-test.
        await User.remove({});

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
        let res = await request.get(process.env.API_BASE + "user").set('Authorization', 'Bearer ' + token).expect(200);

        // Should have a user object.
        expect(res.body.user).to.not.be.empty;

        // Username is the test username.
        expect(res.body.user.username).to.equal(testUser.username);

        // User leagues should be an empty array.
        expect(res.body.user.user_leagues).to.not.be.undefined;

        // Password should not be returned.
        expect(res.body.user.password).to.be.undefined;
    });

});