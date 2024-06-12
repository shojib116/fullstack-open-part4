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

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
};
