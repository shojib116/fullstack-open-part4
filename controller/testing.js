const testRouter = require("express").Router();
const Blog = require("../models/blog");
const User = require("../models/user");

testRouter.post("/reset", async (request, response) => {
  await Blog.deleteMany({});
  await User.deleteMany({});

  response.status(204).end();
});

testRouter.post("/create_blog", async (request, response) => {
  const body = request.body;

  const users = await User.find({});

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
    user: users[0]._id,
  });

  const savedBlog = await blog.save();

  response.status(200).send(savedBlog);
});

module.exports = testRouter;
