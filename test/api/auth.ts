import {request, login, testUser, getTestUser} from "../common";
import {expect} from "chai";
import {model as User} from "../../server/api/user/model";

before(async () => {
    await User.remove({});
});

describe("# Auth", () => {

    it("should retrieve the token", async () => {
        let token = await login();
        expect(token).to.not.be.empty;
    });

    it("should not login with the right user but wrong password", async () => {

        // Create a test user if not already exists.
        await getTestUser();

        // Login with bad password.
        let res = await request.post(process.env.API_BASE + "login")
            .send({"username": testUser.username, "password": "anythingGoesHere"})
            .expect(400);

        expect(res.body.message).to.equal("Invalid credentials.");
    });

    it("should return invalid credentials error", async () => {

        let res;
        // Wrong password.
        res = await request.post(process.env.API_BASE + "login")
            .send({"username": testUser.username, "password": ""})
            .expect(400);

        expect(res.body.message).to.equal("Invalid credentials.");

        // Wrong user.
        res = await request.post(process.env.API_BASE + "login")
            .send({"username": "anotherusername", "password": testUser.password})
            .expect(400);

        expect(res.body.message).to.equal("Invalid credentials.");
    });

    it("should fail to view user invalid token", async () => {
        let res = await request.get(process.env.API_BASE + "user")
            .set('Authorization', 'Bearer awdawdawd')
            .expect(401);

        expect(res.body.message).to.equal("Authorization is required.");
    });

    it("should fail to view user no token", async () => {
        let res = await request.get(process.env.API_BASE + "user")
            .expect(401);

        expect(res.body.message).to.equal("Authorization is required.");
    });

    it("should authenticate and return user", async () => {
        let token: string = await login();
        let res = await request.get(process.env.API_BASE + "user")
            .set('Authorization', 'Bearer ' + token)
            .send({user_id: (await getTestUser()).id})
            .expect(200);

        expect(res.body.user).to.not.be.empty;
    });

    it("should 404 cannot post to user", async () => {
        let token: string = await login();
        await request.post(process.env.API_BASE + "user")
            .set('Authorization', 'Bearer ' + token)
            .expect(404);
    });

})
;