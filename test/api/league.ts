import {request, login, getTestUserToken, testUser, createTestUser, getTestUser} from "../common";
import {expect} from "chai";
import {model as League, ILeague} from "../../server/api/league/model";
import {model as UserLeague, IUserLeague} from "../../server/api/userleague/model";
import {model as User, IUser, IUserView} from "../../server/api/user/model";

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
        await League.deleteOne({name: testCreateLeague.name});
        await User.deleteOne({username: testUser.username});

        // Login.
        let token: string = await login();

        // Insert league.
        let res = await request.post(process.env.API_BASE + "league")
            .set('Authorization', 'Bearer ' + token)
            .send(testCreateLeague).expect(200);

        expect(res.body.id).to.not.be.empty;

        // Expect league has user as only user and is admin.

        let league: ILeague = await League.findById(res.body.id).populate("user_leagues");
        let user: IUser = await getTestUser();

        expect(league).to.not.be.empty;
        expect(league.name).to.equal(testCreateLeague.name);
        expect(league.description).to.equal(testCreateLeague.description);
        expect(league.code).to.not.be.empty;
        expect(league.user_leagues).to.have.lengthOf(1);
        expect(league.user_leagues[0].user_id.toString()).to.equal(user.id);

        // Get user 'view' and expect user_leagues to populate dynamically.
        let userView:IUserView = await User.view(user.id);
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