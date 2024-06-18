const { test, after, beforeEach, describe } = require("node:test");
const assert = require("node:assert");
const supertest = require("supertest");
const mongoose = require("mongoose");
const app = require("../app");
const helper = require("./test_helper");
const User = require("../models/user");

const api = supertest(app);

describe("user addition fails with status code 400", () => {
  beforeEach(async () => {
    await User.deleteMany({});

    const userObjects = helper.initialUsers.map((user) => new User(user));
    const promiseArray = userObjects.map((user) => user.save());

    await Promise.all(promiseArray);
  });

  test("if username is missing", async () => {
    const newUser = {
      name: "Nazmul Hasan",
      password: "nazmul22",
    };

    const response = await api.post("/api/users").send(newUser).expect(400);
    assert(response.body.error.length > 0);

    const usersAtEnd = await helper.usersIndDB();
    assert.strictEqual(usersAtEnd.length, helper.initialUsers.length);
  });

  test("if username is shorter than 3 characters", async () => {
    const newUser = {
      username: "sh",
      name: "Nazmul Hasan",
      password: "nazmul22",
    };

    const response = await api.post("/api/users").send(newUser).expect(400);
    assert(response.body.error.length > 0);

    const usersAtEnd = await helper.usersIndDB();
    assert.strictEqual(usersAtEnd.length, helper.initialUsers.length);
  });

  test("if password is missing", async () => {
    const newUser = {
      name: "Nazmul Hasan",
      username: "nazmul22",
    };

    const response = await api.post("/api/users").send(newUser).expect(400);
    assert(response.body.error.length > 0);

    const usersAtEnd = await helper.usersIndDB();
    assert.strictEqual(usersAtEnd.length, helper.initialUsers.length);
  });

  test("if username is shorter than 3 characters", async () => {
    const newUser = {
      password: "sh",
      name: "Nazmul Hasan",
      username: "nazmul22",
    };

    const response = await api.post("/api/users").send(newUser).expect(400);
    assert(response.body.error.length > 0);

    const usersAtEnd = await helper.usersIndDB();
    assert.strictEqual(usersAtEnd.length, helper.initialUsers.length);
  });

  after(() => {
    mongoose.connection.close();
  });
});
