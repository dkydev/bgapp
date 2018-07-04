import {request, login, getToken, testUser, deleteUser, createUser} from "./common";
import {expect} from "chai";
import {model as League} from "../server/api/league/model";

//beforeEach(async function() {
//});

describe("# League", () => {

    it("should create a league", async () => {

        const testCreateLeague = {
            name: "My Awesome League",
            description: "a very nice league",
        };

        // Delete league if re-test.
        await League.deleteOne({name: testCreateLeague.name});

        // Login.
        let token: string = await login();

        // Insert league.
        let res = await request.post(process.env.API_BASE + "league")
            .set('Authorization', 'Bearer ' + token)
            .send(testCreateLeague).expect(200);

        expect(res.body.id).to.not.be.empty;
    });

    it("should fail authentication trying to create a league", async () => {

        const testCreateLeague = {
            name: "My Awesome League",
            description: "a very nice league",
        };

        // Login.
        let token: string = await login();

        let res = await request.post(process.env.API_BASE + "league")
            .set('Authorization', 'Bearer ' + token)
            .send(testCreateLeague).expect(401);
    });

    it("should view a league", async () => {

        const testCreateLeague = {
            name: "My Awesome League For Viewing",
            description: "it's very nice to look at",
        };

        // Delete league if re-test.
        await League.deleteOne({name: testCreateLeague.name});

        // Login.
        let token: string = await login();

        // Insert league.
        let res = await request.post(process.env.API_BASE + "league")
            .set('Authorization', 'Bearer ' + token)
            .send(testCreateLeague).expect(200);

        expect(res.body.id).to.not.be.empty;

        let leagueId = res.body.id;

        // Insert league.
        let viewResult = await request.get(process.env.API_BASE + "league")
            .set('Authorization', 'Bearer ' + token)
            .send({id: leagueId}).expect(200);

        expect(viewResult.body.league).to.not.be.empty;
    });


});