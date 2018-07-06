import {request, login, testUser, getTestUser} from "../common";
import {expect} from "chai";
import {model as League, ILeague, createLeague} from "../../server/api/league/model";
import {model as UserLeague, IUserLeague} from "../../server/api/userleague/model";
import {model as User, IUser, IUserView, createUser} from "../../server/api/user/model";

before(async () => {
    await League.remove({});
    await UserLeague.remove({});
});

describe("# League", () => {

    it("should create a league", async () => {

        const testCreateLeague = {
            name: "My Awesome League",
            description: "a very nice league",
        };

        // Delete league/user if re-test.
        await User.deleteOne({username: testUser.username});

        // Login.
        let token: string = await login();

        // Insert league.
        let res = await request.post(process.env.API_BASE + "league")
            .set('Authorization', 'Bearer ' + token)
            .send(testCreateLeague).expect(200);

        expect(res.body.message).to.equal(`Created league ${testCreateLeague.name}.`);

        // Expect league has user as only user and is admin.

        let league: ILeague = await League.findOne({name: testCreateLeague.name}).populate("user_leagues");
        let user: IUser = await getTestUser();

        expect(league).to.not.be.empty;
        expect(league.name).to.equal(testCreateLeague.name);
        expect(league.description).to.equal(testCreateLeague.description);
        expect(league.code).to.not.be.empty;
        expect(league.user_leagues).to.have.lengthOf(1);
        expect(league.user_leagues[0].user_id.toString()).to.equal(user.id);

        // Get user 'view' and expect user_leagues to populate dynamically.
        let userView: IUserView = await User.view(user.id);
        expect(userView.user_leagues).to.have.lengthOf(1);
        expect((userView.user_leagues[0].league_id as ILeague).name).to.equal(testCreateLeague.name);
        expect((userView.user_leagues[0].league_id as ILeague).description).to.equal(testCreateLeague.description);

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

        // Login.
        let token: string = await login();

        // Insert league.
        let res = await request.post(process.env.API_BASE + "league")
            .set('Authorization', 'Bearer ' + token)
            .send(testCreateLeague).expect(200);

        expect(res.body.message).to.equal(`Created league ${testCreateLeague.name}.`);

        let league: ILeague = await League.findOne({name: testCreateLeague.name});

        // Insert league.
        let viewResult = await request.get(process.env.API_BASE + "league")
            .set('Authorization', 'Bearer ' + token)
            .send({code: league.code}).expect(200);

        expect(viewResult.body.league).to.not.be.empty;
    });

    it("should fail authentication trying to join a league", async () => {
        let res = await request.post(process.env.API_BASE + "join")
            .send({code: "abc123"}).expect(401);
    });

    it("should join a league", async () => {

        // Create a league with a different user (not the default test user).
        const testLeagueAdmin = {"username": "testLeagueAdmin", "password": "123456abcdef"};
        let user: IUser = await createUser(testLeagueAdmin);
        const testLeague = {
            name: "Test League for Joining",
            description: "Join Me!!!!",
        };
        let league: ILeague = await createLeague(user.id, testLeague);

        //
        //
        //

        // Login with test user.
        let token: string = await login();

        // Join league.
        let res = await request.post(process.env.API_BASE + "join")
            .set('Authorization', 'Bearer ' + token)
            .send({code: league.code}).expect(200);

        expect(res.body.message).to.equals(`You have joined ${league.name}.`);
    });


});