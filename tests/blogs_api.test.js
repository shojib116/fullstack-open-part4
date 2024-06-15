const { test, after, beforeEach } = require("node:test");
const app = require("../app");
const supertest = require("supertest");
const helper = require("./test_helper");
const assert = require("node:assert");
const Blog = require("../models/blog");
const mongoose = require("mongoose");

const api = supertest(app);

beforeEach(async () => {
  await Blog.deleteMany({});

  const blogObjects = helper.initialBlogs.map((blog) => new Blog(blog));
  const promiseArray = blogObjects.map((blog) => blog.save());

  await Promise.all(promiseArray);
});

test("returning all the blogs in json format", async () => {
  const response = await api
    .get("/api/blogs")
    .expect(200)
    .expect("Content-Type", /application\/json/);

  assert.strictEqual(response.body.length, helper.initialBlogs.length);
});

test("all blogs have an id field", async () => {
  const response = await api.get("/api/blogs").expect(200);

  response.body.map((blog) => assert.strictEqual(typeof blog.id, "string"));
});

test("new blogs can be added without a hiccup", async () => {
  const newBlog = {
    title: "Dummy wars",
    author: "Dummy writer",
    url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/DummyWars.html",
    likes: 100,
  };

  await api
    .post("/api/blogs")
    .send(newBlog)
    .expect(201)
    .expect("Content-Type", /application\/json/);

  const latestBlogs = await helper.blogsInDB();
  assert.strictEqual(latestBlogs.length, helper.initialBlogs.length + 1);

  const titles = latestBlogs.map((blog) => blog.title);
  assert(titles.includes("Dummy wars"));
});

test("value of likes defaults to 0", async () => {
  const newBlog = {
    title: "Dummy wars",
    author: "Dummy writer",
    url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/DummyWars.html",
  };

  const response = await api
    .post("/api/blogs")
    .send(newBlog)
    .expect(201)
    .expect("Content-Type", /application\/json/);

  assert.strictEqual(response.body.likes, 0);
});

after(async () => {
  mongoose.connection.close();
});
