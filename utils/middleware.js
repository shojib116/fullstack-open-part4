const morgan = require("morgan");

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" });
};

morgan.token("body", function (req) {
  return JSON.stringify(req.body);
});

const modifiedMorgan = morgan(
  ":method :url :status :res[content-length] - :response-time ms :body"
);

module.exports = {
  unknownEndpoint,
  modifiedMorgan,
};
