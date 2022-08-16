const compression = require("compression");
const express = require("express");
const helmet = require("helmet");
const morgan = require("morgan");

// Routers
const { artistRouter } = require("./routes/artists.routes");
const { usersRouter } = require("./routes/users.routes");
const { songsRouter } = require("./routes/songs.routes");

// Global error controller
const { globalErrorHandler } = require("./controllers/error.controller");

// Utils
const { AppError } = require("./utils/appError.util");

// Init express app
const app = express();

app.use(express.json());

// Helmet
app.use(helmet());

// Compression
app.use(compression());

// Morgan
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
} else {
  app.use(morgan("combined"));
}

// Endpoints
app.use("/api/v1/artists", artistRouter);
app.use("/api/v1/users", usersRouter);
app.use("/api/v1/songs", songsRouter);

app.all("*", (req, res, next) => {
  next(
    new AppError(
      `${req.method} ${req.originalUrl} not found in this server`,
      404
    )
  );
});

app.use(globalErrorHandler);

module.exports = { app };
