const sqlite3 = require("sqlite3");
const { open } = require("sqlite");
const express = require("express");
const app = express();
const path = require("path");
let db = null;
const bcrypt = require("bcrypt");
const dbpath = path.join(__dirname, "userData.db");
const init = async () => {
  try {
    db = open({
      filename: dbpath,
      driver: sqlite3.Database,
    });
    app.listen(3000, () => {
      console.log("server is starting ");
    });
  } catch (error) {
    console.log("error");
  }
};
init();
app.post("/register/", async (request, response) => {
  let { username, name, password, gender, location } = request.body;
  const hash = await bcrypt.hash(request.body.password, 10);
  const p = `select * from user where username='${username}'`;
  const q = await db.get(p);
  if (request.body.password.length < 5) {
    response.status(400);
    response.send("Password is too short");
  } else {
    if (q === undefined) {
      const w = `insert into user(name,username,password,gender,location) values('${name}','${username}','${password}','${gender}','${location}')`;
      const r = await db.run(w);
      response.status(200);
      response.send("User created successfully");
    } else {
      response.status(400);
      response.send("User already exists");
    }
  }
});
