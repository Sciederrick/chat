const app = require("./app.js");
const db = require("./mongo/db");
const chat = require("./chat/app");

const port = process.env.PORT || 3080;
const port2 = process.env.PORT2 || 3095;
const result = require("dotenv").config();
if (result.error) {
  console.log(result.error);
}

//  Start the database
db.init();

// Start the http server
app.listen(port, () => {
  console.log(
    "\x1b[35m%s\x1b[0m",
    `Server listening on: http://localhost:${port}`
  );
});
