const {
  getShortLivedAccessToken,
  getLongLivedAccessToken,
  getProfileData,
  getUserMediaData,
} = require('./instagram.js');

const Query = {
  Query: {
    getShortLivedAccessToken: () => getShortLivedAccessToken(),
    getLongLivedAccessToken: () => getLongLivedAccessToken(),
    getProfileData: () => getProfileData(),
    getUserMediaData: () => getUserMediaData(),
  },
};

module.exports = Query;
