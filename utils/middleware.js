const morgan = require("morgan");
const logger = require("./logger");

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" });
};

const errorHandler = (error, request, response, next) => {
  logger.error(error.message);

  if (error.name === "CastError") {
    return response.status(400).send({ error: "malformatted id" });
  } else if (error.name === "ValidationError") {
    return response.status(400).json({ error: error.message });
  }

  next(error);
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
  errorHandler,
};
