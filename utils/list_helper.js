const _ = require("lodash");

const dummy = (blogs) => {
  return 1;
};

const totalLikes = (blogs) => {
  const reducer = (sum, item) => sum + item.likes;
  return blogs.reduce(reducer, 0);
};

const favoriteBlog = (blogs) => {
  const maxLikes = Math.max(...blogs.map((blog) => blog.likes));

  const blog = blogs.filter((blog) => blog.likes === maxLikes)[0];

  return { title: blog.title, author: blog.author, likes: blog.likes };
};

const mostBlogs = (blogs) => {
  const blogMap = _.countBy(blogs, "author");
  const author = _.maxBy(Object.keys(blogMap), (author) => blogMap[author]);
  return { author, blogs: blogMap[author] };
};

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
};
