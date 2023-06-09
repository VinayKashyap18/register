const sqlite3 = require("sqlite3");
const { open } = require("sqlite");
const express = require("express");
const app = express();
const path = require("path");
let db = null;
app.use(express.json());
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

app.post("/login/", async (request, response) => {
  const { name, password } = request.body;
  const p = `select * from user where username=${username}`;
  const q = await db.get(p);
  if (q === undefined) {
    response.status(400);
    response.send("Invalid user");
  } else {
    const pa = await bcrypt.compare(password, q.password);
    if (pa === true) {
      response.status(200);
      response.send("Login success!");
    } else {
      response.status(400);
      response.send("Invalid password");
    }
  }
});

app.put("/change-password", async (request, response) => {
  const { username, oldPassword, newPassword } = request.body;
  const p = `select * from user where username=${username}`;
  const q = await db.get(p);
  const pa = await bcrypt.compare(password, q.password);
  if (pa === true) {
    if (newPassword.length < 5) {
      response.status(400);
      response.send("Password is too short");
    } else {
      const w = `update user set password=${newPassword}`;
      response.status(200);
      response.send("Password updated");
    }
  } else {
    response.send("Invalid current password");
    response.status(400);
  }
});
