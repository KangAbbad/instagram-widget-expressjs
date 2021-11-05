const { UserInputError } = require('apollo-server-express');
const { get } = require('axios').default;
const { post } = require('request');
const { promisify } = require('util');

require('dotenv').config();
const postAsync = promisify(post);

async function getShortLivedAccessToken() {
  const { body, statusCode } = await postAsync({
    url: 'https://api.instagram.com/oauth/access_token',
    formData: {
      client_id: process.env.INSTAGRAM_APP_ID,
      client_secret: process.env.INSTAGRAM_APP_SECRET,
      redirect_uri: 'https://httpstat.us/200',
      code: process.env.AUTHORIZATION_CODE,
      grant_type: 'authorization_code',
    },
    header: {
      'content-type': 'multipart/form-data',
      host: 'api.instagram.com',
    },
  });

  const response = JSON.parse(body);

  if (statusCode !== 200) {
    const error_message = response.error_message;
    return new UserInputError(error_message);
  }

  return response;
}

async function getLongLivedAccessToken() {
  let response;
  try {
    response = await get('https://graph.instagram.com/access_token', {
      params: {
        grant_type: 'ig_exchange_token',
        client_secret: process.env.INSTAGRAM_APP_SECRET,
        access_token: process.env.SHORT_LIVED_AT,
      },
      headers: {
        host: 'graph.instagram.com',
      },
    });
  } catch (error) {
    return new UserInputError(error);
  }

  response = response.data;
  return response;
}

async function getProfileData() {
  let response;
  try {
    response = await get('https://graph.instagram.com/me', {
      params: {
        fields: 'id, username, media_count, account_type',
        access_token: process.env.LONG_LIVED_AT,
      },
      headers: {
        host: 'graph.instagram.com',
      },
    });
  } catch (error) {
    return new UserInputError(error);
  }

  response = response.data;
  return response;
}

async function getUserMediaData() {
  let response;
  try {
    response = await get('https://graph.instagram.com/me/media', {
      params: {
        fields: 'id, caption, media_url, media_type, permalink, thumbnail_url, timestamp, username',
        access_token: process.env.LONG_LIVED_AT,
      },
      headers: {
        host: 'graph.instagram.com',
      },
    });
  } catch (error) {
    return new UserInputError(error);
  }

  response = response.data;
  return response.data;
}

module.exports = {
  getShortLivedAccessToken,
  getLongLivedAccessToken,
  getProfileData,
  getUserMediaData,
};
