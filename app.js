const express = require("express");
require("express-async-errors");
const app = express();
const cors = require("cors");
const blogsRouter = require("./controller/blog");
const middleware = require("./utils/middleware");

app.use(cors());
app.use(express.json());
app.use(middleware.modifiedMorgan);

app.use("/api/blogs", blogsRouter);

app.use(middleware.unknownEndpoint);

module.exports = app;
