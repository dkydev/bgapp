import {request, login, getToken} from "./common";

describe("# Auth", () => {

    const endpoint = process.env.API_BASE + "login";

    it("should retrieve the token", () => {
        try {
            return login().then(res => {
                res.status.should.equal(200);
                res.body.token.should.not.be.empty;
            });
        } catch (e) {
            console.log(e);
        }
    });

    it("should not login with the right user but wrong password", () => {
        return request.post(endpoint)
            .send({"username": "testuser", "password": "anythingGoesHere"})
            .expect(401);
    });

    it("should return invalid credentials error", () => {
        return request.post(endpoint)
            .send({"username": "testuser", "password": ""})
            .expect(401)
            .then(res => {
                return request.post(endpoint)
                    .send({"username": "anotherusername", "password": "mypass"})
                    .expect(401);
            });
    });

    it("should fail to view user invalid token", () => {
        return request.post(process.env.API_BASE + "view")
            .set('Authorization', 'Bearer awdawdawd')
            .expect(401);
    });

    it("should fail to view user no token", () => {
        return request.post(process.env.API_BASE + "view")
            .expect(401);
    });

    it("should authenticate and return user", () => {
        return login().then(res => {
            return request.post(process.env.API_BASE + "view")
                .set('Authorization', 'Bearer ' + getToken())
                .expect(200);
        });
    });

})
;