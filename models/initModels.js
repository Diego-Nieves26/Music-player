const initModels = () => {
  const { Artist } = require("./artist.model");
  const { Album } = require("./album.model");
  const { User } = require("./user.model");
  const { Song } = require("./song.model");

  Artist.hasMany(Album, { foreignKey: "artistId" });
  Album.belongsTo(Artist);

  Album.hasMany(Song, { foreignKey: "albumId" });
  Song.belongsTo(Album);

  User.belongsToMany(Song, {
    through: "favoriteSong",
  });
  Song.belongsToMany(User, {
    through: "favoriteSong",
  });
};

module.exports = { initModels };
