const express = require("express");
var cookieParser = require('cookie-parser');
const app = express();
const static = express.static(__dirname + "/public");

const configRoutes = require("./routes");
const exphbs = require("express-handlebars");
app.use(cookieParser());
app.use(static);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

configRoutes(app);


app.listen(3000, () => {
    console.log("We've now got a server!");
    console.log("Your routes will be running on http://localhost:3000");
});


// const user = require("./data/users");
// const notes = require("./data/notes")
// const connection = require("./config/mongoConnection");
// async function main() {
// try {
//     await user.createUser(1, "Kunj", "Desai", "KunjDesai@gmail.com", "kunj");
// } catch (error) {
//     console.error(error);
// }

// try {
//     await user.createUser(2, "Nihir", "Patel", "nihirPatel@gmail.com", "nihir");
// } catch (error) {
//     console.error(error);
// }
// try {
//     await user.createUser(3, "Sunil", "Kumar", "sunilKumar@gmail.com", "sunil");
// } catch (error) {
//     console.error(error);
// }
// try {
//     await user.createUser(4, "Rahul", "kumar", "rahulkumar@gmail.com", "rahul");
// } catch (error) {
//     console.error(error);
// }

//     try {
//         await notes.createNotes("5dd20354faabf50a9d241ae5", "First title", "First content");
//     } catch (error) {
//         console.error(error);
//     }
//     try {
//         await notes.createNotes("5dd20354faabf50a9d241ae5", "Second title", "First content");
//     } catch (error) {
//         console.error(error);
//     }
//     try {
//         await notes.createNotes("5dd20354faabf50a9d241ae5", "Third title", "First content");
//     } catch (error) {
//         console.error(error);
//     }
//     try {
//         await notes.createNotes("5dd20354faabf50a9d241ae5", "Fourth title", "First content");
//     } catch (error) {
//         console.error(error);
//     }
//     const db = await connection();
//     await db.serverConfig.close();
// }


// main();