const blogsRouter = require("express").Router();
const jwt = require("jsonwebtoken");
const middleware = require("../utils/middleware");
const Blog = require("../models/blog");
const User = require("../models/user");
const blog = require("../models/blog");

blogsRouter.get("/", async (request, response) => {
  const blogs = await Blog.find({}).populate("user", { username: 1, name: 1 });
  response.json(blogs);
});

blogsRouter.get("/:id", async (request, response) => {
  const blog = await Blog.findById(request.params.id).populate("user", {
    username: 1,
    name: 1,
  });
  response.json(blog);
});

blogsRouter.post("/", middleware.userExtractor, async (request, response) => {
  const body = request.body;
  const user = request.user;

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
    user: user._id,
  });

  const savedBlog = await blog.save();
  user.blogs = user.blogs.concat(savedBlog._id);
  await user.save();

  response.status(201).send(savedBlog);
});

blogsRouter.post("/:id/comments", async (request, response) => {
  const comment = request.body.comment;
  const blogId = request.params.id;

  const blog = await Blog.findById(request.params.id);

  blog.comments = blog.comments.concat(comment);

  const returnedBlog = await blog.save();
  response.json(returnedBlog);
});

blogsRouter.put("/:id", async (request, response) => {
  const body = request.body;

  const blog = {
    user: body.user,
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
  };

  const returnedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, {
    new: true,
    runValidators: true,
    context: "query",
  });

  response.json(returnedBlog);
});

blogsRouter.delete(
  "/:id",
  middleware.userExtractor,
  async (request, response) => {
    const user = request.user;

    const blog = await Blog.findById(request.params.id);

    if (!blog) {
      return response.status(204).end();
    }

    if (blog.user.toString() !== user._id.toString()) {
      return response.status(403).json({
        error: "sorry, you are not authorized to perform this action",
      });
    }

    await blog.deleteOne();
    response.status(204).end();
  }
);

module.exports = blogsRouter;
