const express = require("express");
require("dotenv").config();
require("express-async-errors");
const app = express();
const cors = require("cors");
const blogsRouter = require("./controller/blog");
const userRouter = require("./controller/user");
const middleware = require("./utils/middleware");
const loginRouter = require("./controller/login");

app.use(cors());
app.use(express.json());
app.use(middleware.modifiedMorgan);

app.use("/api/blogs", blogsRouter);
app.use("/api/users", userRouter);
app.use("/api/login", loginRouter);

if (process.env.NODE_ENV === "test") {
  const testRouter = require("./controller/testing");
  app.use("/api/tests", testRouter);
}

app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

module.exports = app;
