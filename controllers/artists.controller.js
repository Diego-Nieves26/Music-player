const { ref, uploadBytes, getDownloadURL } = require("firebase/storage");

// Models
const { Artist } = require("../models/artist.model");
const { Album } = require("../models/album.model");

// Utils
const { catchAsync } = require("../utils/catchAsync.util");
const { AppError } = require("../utils/appError.util");
const { storage } = require("../utils/firebase.util");

const getAllArtists = catchAsync(async (req, res, next) => {
  const artists = await Artist.findAll({
    where: { status: "active" },
    include: Album,
  });

  res.status(201).json({
    status: "success",
    artists,
  });
});

const createArtist = catchAsync(async (req, res, next) => {
  const { name, genre } = req.body;

  const imgRef = ref(storage, `artists/${Date.now()}_${req.file.originalname}`);

  const imgRes = await uploadBytes(imgRef, req.file.buffer);

  const imgFullPath = await getDownloadURL(imgRef);

  const newArtist = await Artist.create({
    name,
    genre,
    imgUrl: imgFullPath,
  });

  res.status(201).json({
    status: "success",
    newArtist,
  });
});

const updateArtist = catchAsync(async (req, res, next) => {
  const { artist } = req;
  const { name } = req.body;

  await artist.update({ name });

  res.status(204).json({ status: "success" });
});

const disableArtist = catchAsync(async (req, res, next) => {
  const { artist } = req;

  await artist.update({ status: "disabled" });

  res.status(204).json({ status: "success" });
});

const createAlbum = catchAsync(async (req, res, next) => {
  const { artistId } = req.params;
  const { title, genre } = req.body;

  const artist = await Artist.findOne({
    where: { id: artistId, status: "active" },
  });

  if (!artist) {
    return next(new AppError("Artist not found", 404));
  }

  const imgRef = ref(storage, `albums/${Date.now()}_${req.file.originalname}`);

  const imgRes = await uploadBytes(imgRef, req.file.buffer);

  const imgFullPath = await getDownloadURL(imgRef);

  const newAlbum = await Album.create({
    artistId,
    title,
    genre,
    imgUrl: imgFullPath,
  });

  res.status(200).json({
    status: "success",
    newAlbum,
  });
});

module.exports = {
  getAllArtists,
  createArtist,
  updateArtist,
  disableArtist,
  createAlbum,
};
