const { test, after, beforeEach, beforeAll } = require("node:test");
const app = require("../app");
const supertest = require("supertest");
const helper = require("./test_helper");
const assert = require("node:assert");
const Blog = require("../models/blog");
const mongoose = require("mongoose");

const api = supertest(app);

beforeEach(async () => {
  await Blog.deleteMany({});
  const userId = await helper.getSavedUserId(api);

  const blogObjects = helper.initialBlogs.map(
    (blog) => new Blog({ ...blog, user: userId })
  );
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

  const token = await helper.getToken(api);
  await api
    .post("/api/blogs")
    .send(newBlog)
    .set("Authorization", `Bearer ${token}`)
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

  const token = await helper.getToken(api);
  const response = await api
    .post("/api/blogs")
    .send(newBlog)
    .set("Authorization", `Bearer ${token}`)
    .expect(201)
    .expect("Content-Type", /application\/json/);

  assert.strictEqual(response.body.likes, 0);
});

test("blog cannot be saved without title", async () => {
  const newBlog = {
    author: "Dummy writer",
    url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/DummyWars.html",
    likes: 50,
  };

  const token = await helper.getToken(api);
  await api
    .post("/api/blogs")
    .send(newBlog)
    .set("Authorization", `Bearer ${token}`)
    .expect(400);
});

test("blog cannot be saved without url", async () => {
  const newBlog = {
    title: "Dummy wars",
    author: "Dummy writer",
    likes: 50,
  };

  const token = await helper.getToken(api);
  await api
    .post("/api/blogs")
    .send(newBlog)
    .set("Authorization", `Bearer ${token}`)
    .expect(400);
});

test("updating a single blog succeeds", async () => {
  const blogsAtStart = await helper.blogsInDB();

  const updatedTitle = "I'm radioactive, radioactive";
  const blogToUpdate = blogsAtStart[0];
  const updatedBlog = {
    title: updatedTitle,
    author: blogToUpdate.author,
    url: blogToUpdate.url,
    likes: blogToUpdate.likes,
  };

  await api.put(`/api/blogs/${blogToUpdate.id}`).send(updatedBlog).expect(200);

  const blogsAtEnd = await helper.blogsInDB();
  const titles = blogsAtEnd.map((blog) => blog.title);

  assert(titles.includes(updatedTitle));
});

test("a single blog can be deleted with status code 204", async () => {
  const blogsAtStart = await helper.blogsInDB();
  const blogToDelete = blogsAtStart[0];

  const token = await helper.getToken(api);
  await api
    .delete(`/api/blogs/${blogToDelete.id}`)
    .set("Authorization", `Bearer ${token}`)
    .expect(204);

  const blogsAtEnd = await helper.blogsInDB();

  assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length - 1);

  const titles = blogsAtEnd.map((blog) => blog.title);
  assert(!titles.includes(blogToDelete.title));
});

after(async () => {
  mongoose.connection.close();
});
