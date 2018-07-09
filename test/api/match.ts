import {request, login, testUser, getTestUser} from "../common";
import {expect} from "chai";
import {model as League, ILeague, createLeague} from "../../server/api/league/model";
import {model as UserLeague, IUserLeague} from "../../server/api/league/user_league/model";
import {model as User, IUser, IUserView, createUser} from "../../server/api/user/model";
import {model as Match, IMatch} from "../../server/api/match/model";

before(async () => {
    await League.remove({});
    await UserLeague.remove({});
    await Match.remove({});
});

/**
 * League and match creation helper.
 *
 * @param {string} token
 * @param {string} leagueName
 * @param {string} matchName
 * @returns {Promise<{league_id: string; code:string, match_id: string}>}
 */
const createTestLeagueAndMatch = async (token: string, leagueName: string, matchName: string) => {

    let leagueResult = await
        request.post(process.env.API_BASE + "leagues")
            .set('Authorization', 'Bearer ' + token)
            .send({name: leagueName}).expect(200);

    let matchResult = await
        request.post(process.env.API_BASE + "matches")
            .set('Authorization', 'Bearer ' + token)
            .send({league_id: leagueResult.body.league_id, name: matchName}).expect(200);

    return {
        league_id: leagueResult.body.league_id,
        code:leagueResult.body.code,
        match_id: matchResult.body.match_id
    };
};

describe("# Match", () => {

    it("should create a league and match", async () => {

        // Login.
        let token: string = await login();

        // Insert league.
        const testCreateLeague = {
            name: "Our Board Game League",
            description: "Just chillin'.",
        };
        let leagueResult = await request.post(process.env.API_BASE + "leagues")
            .set('Authorization', 'Bearer ' + token)
            .send(testCreateLeague).expect(200);

        expect(leagueResult.body.message).to.equal(`Created league ${testCreateLeague.name}.`);
        expect(leagueResult.body.league_id).is.not.empty;

        //
        //

        // Insert match.
        const testCreateMatch = {
            league_id: leagueResult.body.league_id,
            name: "Settlers of Catan"
        };
        let matchResult = await request.post(process.env.API_BASE + "matches")
            .set('Authorization', 'Bearer ' + token)
            .send(testCreateMatch).expect(200);

        expect(matchResult.body.message).to.equal(`Created match playing ${testCreateMatch.name}.`);
        expect(matchResult.body.match_id).to.not.be.empty;


        //
        //

        let match = await Match.findById(matchResult.body.match_id);

        expect(match).to.not.be.empty;
        expect(match.name).to.equal(testCreateMatch.name);
        expect(match.league_id.toString()).to.equal(leagueResult.body.league_id);
        expect(match.createdAt).to.be.a("Date");
        expect(match.updatedAt).to.be.a("Date");
        expect(match.completed).to.be.false;
        expect(match.user_match).to.be.an("Array");
        expect(match.user_match).to.have.lengthOf(0);
    });

    it("should fail to create a match", async () => {
        // Login.
        let token: string = await login();

        // Insert league.
        let res = await request.post(process.env.API_BASE + "matches")
            .set('Authorization', 'Bearer ' + token)
            .send({}).expect(400);

        expect(res.body.message).to.equal(`Invalid parameters.`);
        expect(res.body.errors).to.have.lengthOf(2);
    });

    it("should fail authentication trying to create a match", async () => {

        let res = await request.post(process.env.API_BASE + "matches")
            .send({}).expect(401);

        expect(res.body.message).to.equal("Authorization is required.");
    });

    it("should view a match", async () => {

        // Login.
        let token: string = await login();

        let leageMatchResult:any = await createTestLeagueAndMatch(token, "TestViewLeague", "TestViewMatch");

        // Insert league.
        let viewResult = await request.get(process.env.API_BASE + `matches/${leageMatchResult.match_id}`)
            .set('Authorization', 'Bearer ' + token)
            .expect(200);

        expect(viewResult.body.match).to.not.be.empty;
        expect(viewResult.body.match).to.not.be.empty;
        expect(viewResult.body.match.name).to.equal("TestViewMatch");
        expect(viewResult.body.match._id.toString()).to.equal(leageMatchResult.match_id);
        expect(viewResult.body.match.league_id.toString()).to.equal(leageMatchResult.league_id);

        // Dates are converted to strings when JSON encoded.
        expect(viewResult.body.match.createdAt).to.be.a("String");
        expect(viewResult.body.match.updatedAt).to.be.a("String");

        //
        expect(viewResult.body.match.completed).to.be.false;
        expect(viewResult.body.match.user_match).to.be.an("Array");
        expect(viewResult.body.match.user_match).to.have.lengthOf(0);
    });

    it("should fail to view a match", async () => {
        // Login.
        let token: string = await login();

        // Get 'matches' without ID specified.
        let res = await request.get(process.env.API_BASE + "matches")
            .set('Authorization', 'Bearer ' + token)
            .expect(404);
    });

    it("should join a match", async () => {

    });


});