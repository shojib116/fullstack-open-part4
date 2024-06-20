const Blog = require("../models/blog");
const User = require("../models/user");

const initialBlogs = [
  {
    title: "React patterns",
    author: "Michael Chan",
    url: "https://reactpatterns.com/",
    likes: 7,
  },
  {
    title: "Go To Statement Considered Harmful",
    author: "Edsger W. Dijkstra",
    url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
    likes: 5,
  },
  {
    title: "Canonical string reduction",
    author: "Edsger W. Dijkstra",
    url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
    likes: 12,
  },
  {
    title: "First class tests",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll",
    likes: 10,
  },
  {
    title: "TDD harms architecture",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html",
    likes: 0,
  },
  {
    title: "Type wars",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
    likes: 2,
  },
];

const initialUsers = [
  {
    username: "nhs",
    name: "Nazmul Hasan Shajib",
    password: "shajib",
  },
];

const blogsInDB = async () => {
  const blogs = await Blog.find({});
  return blogs.map((blog) => blog.toJSON());
};

const usersIndDB = async () => {
  const users = await User.find({});
  return users.map((user) => user.toJSON());
};

const getSavedUserId = async (api) => {
  await User.deleteMany({});
  const user = initialUsers[0];
  const response = await api.post("/api/users").send(user);
  return response.body.id;
};

const getToken = async (api) => {
  const user = initialUsers[0];
  const response = await api.post("/api/login").send({
    username: user.username,
    password: user.password,
  });

  return response.body.token;
};

module.exports = {
  initialBlogs,
  initialUsers,
  blogsInDB,
  usersIndDB,
  getSavedUserId,
  getToken,
};
