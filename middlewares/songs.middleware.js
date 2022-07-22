// Models
const { Song } = require("../models/song.model");
const { Album } = require("../models/album.model");

// Utils
const { AppError } = require("../utils/appError.util");
const { catchAsync } = require("../utils/catchAsync.util");

const songExists = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const song = await Song.findOne({ where: { id, status: "active" } });

  if (!song) {
    return next(new AppError("Song not found", 404));
  }

  req.song = song;
  next();
});

const albumExists = catchAsync(async (req, res, next) => {
  const { albumId } = req.params;

  const album = await Album.findOne({
    where: { id: albumId, status: "active" },
  });

  if (!album) {
    return next(new AppError("Song not found", 404));
  }

  req.album = album;
  next();
});

module.exports = { songExists, albumExists };
