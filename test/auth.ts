import {request, login, getToken, testUser, createUser, deleteUser} from "./common";
import {expect} from "chai";

describe("# Auth", () => {

    it("should retrieve the token", async () => {
        let token = await login();
        expect(token).to.not.be.empty;
    });

    it("should not login with the right user but wrong password", async () => {
        await deleteUser(testUser.username);
        await createUser();
        await request.post(process.env.API_BASE + "login")
            .send({"username": testUser.username, "password": "anythingGoesHere"})
            .expect(401);
    });

    it("should return invalid credentials error", async () => {
        // Wrong password.
        await request.post(process.env.API_BASE + "login")
            .send({"username": testUser.username, "password": ""})
            .expect(401);

        // Wrong user.
        await request.post(process.env.API_BASE + "login")
            .send({"username": "anotherusername", "password": testUser.password})
            .expect(401);
    });

    it("should fail to view user invalid token", async () => {
        await request.post(process.env.API_BASE + "view")
            .set('Authorization', 'Bearer awdawdawd')
            .expect(401);
    });

    it("should fail to view user no token", async () => {
        return request.post(process.env.API_BASE + "view")
            .expect(401);
    });

    it("should authenticate and return user", async () => {
        await login()
        await request.post(process.env.API_BASE + "view")
            .set('Authorization', 'Bearer ' + getToken())
            .expect(200);
    });

})
;