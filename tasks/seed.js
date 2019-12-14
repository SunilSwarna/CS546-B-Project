const dbConnection = require('../config/mongoConnection');
const data = require('../data/');
const users = data.users;
const comments = data.comments;
const tags = data.tags;
const notes = data.notes;
const friends = data.friends;
const default_pw = "123";
// const bcrypt = require("bcrypt");
// const saltRounds = 16;
//const default_hashed_pw = await bcrypt.hash(default_pw, saltRounds);
//console.log(typeof(default_hashed_pw));

async function main() {
    try {
        const db = await dbConnection();
        await db.dropDatabase();
      //  const default_hashed_pw = await bcrypt.hash(default_pw, saltRounds);


        //add users
        let sunil_id=await users.createUser("sunil","swarna","sunil@gold.com","phill")
        let sunil2_id=await users.createUser("sunil","kumar","sunil@gmail.com","phill")
        let rahul_id=await users.createUser("Rahul","kampati","Rahul@drinker.com","phill")
        let rahul2_id=await users.createUser("Rahul","kamapati","rahul@kamapati.com","phill")
        let divya_id= await users.createUser("Divya","swarna","divya@gold.com","phill")
      
        let divya2_id=-await users.createUser("Divya","goalla","divya@goalla.com","phill")
        let kunj_id=await users.createUser("kunj","desai","kunj@god.com","phill")
        let kunj1_id=await users.createUser("kunj","kumar","kunj@kumar.com","phill")

        //add avatars
        sunilnote_id= await notes.createNotes(sunil_id,"sunil is fucker","sunil is verified fucker",1200,40.745094,-74.024255,["#traveldudes","#campfire_daily"]);
        sunil2note_id= await notes.createNotes(sunil2_id,"sunil is fucker2","sunil is verified fucker2",1200,40.757500,-74.047690,["#fridaynight","#fridaysforfuture"]);
        sunilnote_id1= await notes.createNotes(sunil_id,"title2","sunil content 2",1200,40.746300,-74.049520,["#nature","#streetstyle"]);
        sunilnote_id2= await notes.createNotes(sunil_id,"title3","sunil content 3",1200,40.745094,-74.024255,["#fridaynight","#fridaysforfuture"]);
        sunilote_id4= await notes.createNotes(sunil_id,"title4","sunil content 4",1200,40.746300,-74.049520,["#fridaynight","#fridaysforfuture"]);
        sunilnote_id5= await notes.createNotes(sunil_id,"title5","sunil content 5",1200,40.746300,-74.049520,["#nature","#streetstyle"]);
        sunilnote_id6= await notes.createNotes(sunil_id,"title6","sunil content 6",1200,40.745094,-74.024255,["#fridaynight","#fridaysforfuture"]);
        sunilote_id7= await notes.createNotes(sunil_id,"title7","sunil content 7",1200,40.746300,-74.049520,["#fridaynight","#fridaysforfuture"]);
        sunilote_id7= await notes.createNotes(rahul_id,"rahul title","rahul content 7",1200,40.746300,-74.049520,["#fridaynight","#fridaysforfuture"]);



        await comments.createComment(sunilnote_id,rahul_id,"I agree with the title")
        await comments.createComment(sunilnote_id,divya_id,"I agree with the title too")

       let sunil=await users.getUserByID(sunil_id)
       let sunil2=await users.getUserByID(sunil2_id)
       let rahul=await users.getUserByID(rahul_id) 
       let rahul2=await users.getUserByID(rahul2_id)    
       let divya=await users.getUserByID(divya_id) 
       let kunj= await users.getUserByID(kunj_id)
       await friends.addFriend(sunil.friendID,sunil_id,sunil2_id)
       await friends.addFriend(sunil.friendID,sunil_id,rahul_id)
        await friends.addFriend(sunil.friendID,sunil_id,divya_id)
        await friends.addFriend(kunj.friendID,kunj_id,sunil_id)
       await friends.approveFriend(rahul.friendID,rahul_id,sunil_id)
       // await Users.addAvatar("admin2");
        // await Users.addAvatar("admin3");
        // await Users.addAvatar("PrecisionWing");
        // await Users.addAvatar("Lumen-NyaRuko");
        // await Users.addAvatar("HeroLonely_PvP");
        // await Users.addAvatar("CanadianMason");
        // await Users.addAvatar("AGI4RexIegend01");
        // await Users.addAvatar("7gates_of_hell");
        // await Users.addAvatar("Silk2g");
        // await Users.addAvatar("_Ecli9seS7y");
        // await Users.addAvatar("HuyaTV-11748951");
        // await Users.addAvatar("MBT_Layzan");
        // await Users.addAvatar("Lt-Zomb1e");
        // await Users.addAvatar("Superiorities");
        // await Users.addAvatar("HEHLL1225");
        // await Users.addAvatar("SYM-Incarnate");
        // await Users.addAvatar("FLOT-Crotan");
        // await Users.addAvatar("leonid_47");
        // await Users.addAvatar("AZGD-HungMammoth");



        // let admin1 = await Users.findUserByUserName("admin1");
        // let admin2 = await Users.findUserByUserName("admin2");
        // let admin3 = await Users.findUserByUserName("admin3");
        // let CanadianMason = await Users.findUserByUserName("CanadianMason");
        // let HungMammoth = await Users.findUserByUserName("AZGD-HungMammoth");
        // let Silk2g = await Users.findUserByUserName("Silk2g");


        // //add reports
        // let report1 = await Report.addReport("admin1", "CanadianMason", "aimbot", { path: "public/uploads/seed1.png" });
        // CanadianMason.received_reports.push(report1._id);
        // admin1.created_reports.push(report1._id);
        // await Users.updateUser(CanadianMason._id, CanadianMason);
        // await Users.updateUser(admin1._id, admin1);

        // let report2 = await Report.addReport("Silk2g", "AZGD-HungMammoth", "test the report", { path: "public/uploads/seed2.jpg" });
        // HungMammoth.received_reports.push(report2._id);
        // Silk2g.created_reports.push(report2._id);
        // await Users.updateUser(HungMammoth._id, HungMammoth);
        // await Users.updateUser(Silk2g._id, Silk2g);

        // //add polls
        // let poll1 = await Poll.addPoll("CanadianMason");
        // await Users.newAdminPendingVote(poll1);
        // CanadianMason.label_status = "Processing";
        // await Users.updateUser(CanadianMason._id, CanadianMason);
        // // admin1.pending_votes.push(poll1._id);
        // // admin2.pending_votes.push(poll1._id);
        // // admin3.pending_votes.push(poll1._id);
        // // await Users.updateUser(admin1._id, admin1);
        // // await Users.updateUser(admin2._id, admin2);
        // // await Users.updateUser(admin3._id, admin3);

        // let poll2 = await Poll.addPoll("AZGD-HungMammoth");
        // await Users.newAdminPendingVote(poll2);
        // HungMammoth.label_status = "Processing";
        // await Users.updateUser(HungMammoth._id, HungMammoth);
        // // admin1.pending_votes.push(poll2._id);
        // // admin2.pending_votes.push(poll2._id);
        // // admin3.pending_votes.push(poll2._id);
        // // await Users.updateUser(admin1._id, admin1);
        // // await Users.updateUser(admin2._id, admin2);
        // // await Users.updateUser(admin3._id, admin3);

        // //add comments
        // let comment1 = await Comment.addComment("admin3", "I agree he's a cheater.");
        // report1 = await Report.getReportByReportedPlayer("CanadianMason");
        // report1.comments.push(comment1._id);
        // await Report.updateReport(report1._id, report1)

        // let comment2 = await Comment.addComment("SYM-Incarnate", "haha");
        // report2 = await Report.getReportByReportedPlayer("AZGD-HungMammoth");
        // report2.comments.push(comment2._id);
        // await Report.updateReport(report2._id, report2)

        // //add appeals
        // //await Appeal.addAppeal("AZGD-HungMammoth", "My friend is trolling");

        // //for the appeal one, update his canAppeal to be false.
        // let appealedGuy = await Users.findUserByUserName("AZGD-HungMammoth");
        // appealedGuy.canAppeal = false;
        // await Users.updateUser(appealedGuy._id, appealedGuy);

        console.log('Done seeding database');
        console.log('All these seeded users have a default password of \"123\"')

        //await db.close();
    } catch (e) {
        console.log(e);
    }
}

main();