const express = require("express");
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
app.use(middleware.tokenExtractor);

app.use("/api/blogs", blogsRouter);
app.use("/api/users", userRouter);
app.use("/api/login", loginRouter);

app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

module.exports = app;
