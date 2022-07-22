const express = require("express");

// Controllers
const {
  getAllArtists,
  createArtist,
  updateArtist,
  disableArtist,
  createAlbum,
} = require("../controllers/artists.controller");

// Middlewares
const { protectSession } = require("../middlewares/auth.middleware");
const { artistExists } = require("../middlewares/artist.middleware");

// Utils
const { upload } = require("../utils/upload.util");

const artistRouter = express.Router();

artistRouter.get("/", getAllArtists);

artistRouter.use(protectSession);

artistRouter.post("/", upload.single("imagen"), createArtist);

artistRouter.patch("/:id", artistExists, updateArtist);

artistRouter.delete("/:id", artistExists, disableArtist);

artistRouter.post("/albums/:artistId", upload.single("imagen"), createAlbum);

module.exports = { artistRouter };
