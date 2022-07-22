const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

// Models
const { User } = require("../models/user.model");

// Utils
const { catchAsync } = require("../utils/catchAsync.util");
const { AppError } = require("../utils/appError.util");

dotenv.config({ path: "./config.env" });

const protectSession = catchAsync(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return next(new AppError("Invalid token", 403));
  }

  const decoded = await jwt.verify(token, process.env.JWT_SECRET);

  const user = await User.findOne({
    where: { id: decoded.id, status: "active" },
  });

  if (!user) {
    return next(
      new AppError("The owner of this token doesnt exist anymore", 403)
    );
  }

  req.sessionUser = user;
  next();
});

const protectUserAcoount = catchAsync(async (req, res, next) => {
  const { sessionUser, user } = req;

  if (user.id !== sessionUser.id) {
    return next(new AppError("You do not own this account", 403));
  }

  next();
});

module.exports = { protectSession, protectUserAcoount };
