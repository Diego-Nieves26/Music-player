// Models
const { Song } = require("../models/song.model");
const { Album } = require("../models/album.model");
const { Artist } = require("../models/artist.model");
const { FavoriteSong } = require("../models/favoriteSong.model");

// Utils
const { catchAsync } = require("../utils/catchAsync.util");

const createSong = catchAsync(async (req, res, next) => {
  const { album } = req;
  const { title } = req.body;

  const song = await Song.create({ title, albumId: album.id });

  res.status(201).json({
    status: "success",
    song,
  });
});

const getAllSongsFromAnAlbum = catchAsync(async (req, res, next) => {
  const { albumId } = req.params;

  const songs = await Song.findAll({
    where: { albumId, status: "active" },
    include: [{ model: Album, include: [{ model: Artist }] }],
  });

  res.status(201).json({
    status: "success",
    songs,
  });
});

const updateSong = catchAsync(async (req, res, next) => {
  const { song } = req;
  const { title } = req.body;

  await song.update({ title });

  res.status(204).json({ status: "success" });
});

const disableSong = catchAsync(async (req, res, next) => {
  const { song } = req;

  await song.update({ status: "disabled" });

  res.status(204).json({ status: "success" });
});

const markAsFavorite = catchAsync(async (req, res, next) => {
  const { sessionUser } = req;
  const { songId } = req.params;

  const favoriteSong = await FavoriteSong.findOne({
    where: { songId, userId: sessionUser.id },
  });

  if (!favoriteSong) {
    const newFavoriteSong = await FavoriteSong.create({
      songId,
      userId: sessionUser.id,
    });

    return res.status(204).json({ status: "success", newFavoriteSong });
  }

  if (favoriteSong.favorite) {
    favoriteSong.update({ favorite: false });

    return res.status(204).json({ status: "success", favoriteSong });
  }

  favoriteSong.update({ favorite: true });

  res.status(204).json({ status: "success", favoriteSong });
});

module.exports = {
  createSong,
  getAllSongsFromAnAlbum,
  updateSong,
  disableSong,
  markAsFavorite,
};
