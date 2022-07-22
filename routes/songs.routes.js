const express = require("express");

// Controllers
const {
  createSong,
  getAllSongsFromAnAlbum,
  updateSong,
  disableSong,
  markAsFavorite,
} = require("../controllers/songs.controller");

// Middlewares
const { protectSession } = require("../middlewares/auth.middleware");
const { songExists, albumExists } = require("../middlewares/songs.middleware");

const songsRouter = express.Router();

songsRouter.get("/:albumId", albumExists, getAllSongsFromAnAlbum);

songsRouter.use(protectSession);

songsRouter.post("/:albumId", albumExists, createSong);

songsRouter.patch("/:id", songExists, updateSong);

songsRouter.delete("/:id", songExists, disableSong);

songsRouter.post("/favorite/:songId", markAsFavorite);

module.exports = { songsRouter };
