const express = require('express');
const cors = require('cors');
const { get } = require('axios').default;
const { post } = require('request');
const { promisify } = require('util');
const { ApolloServer } = require('apollo-server-express');
const cron = require('node-cron');
const multer = require('multer');

require('dotenv').config();
const upload = multer();
const postAsync = promisify(post);

const typeDefs = require('./schema');
const resolvers = require('./resolvers');

const PORT = process.env.PORT || 4000;

const app = express();
app.use(cors());
// for parsing application/json
app.use(express.json());
// for parsing application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: false }));
// for parsing multipart/form-data
app.use(upload.array()); 
app.use(express.static('public'));

const onGetAuthCode = (req, res, next) => {
  return res.send(`<a href='https://api.instagram.com/oauth/authorize?client_id=${process.env.INSTAGRAM_APP_ID}&redirect_uri=${process.env.REDIRECT_URI}&scope=user_media,user_profile&response_type=code' target="_blank"> Connect to Instagram </a>`);
}

const onGetShortLivedAccessToken = async (req, res) => {
  const resJson = {
    status: 0,
    data: {},
    error_message: '',
  };

  const { body, statusCode } = await postAsync({
    url: `https://api.instagram.com/oauth/access_token`,
    formData: {
      redirect_uri: req.body.redirect_uri ||  'https://httpstat.us/200',
      grant_type: req.body.grant_type || 'authorization_code',
      client_id: req.body.client_id,
      client_secret: req.body.client_secret,
      code: req.body.code,
    },
    header: {
      'content-type': 'multipart/form-data',
      host: 'api.instagram.com',
    },
  });

  const response = JSON.parse(body);
  resJson.status = statusCode;
  
  if (statusCode !== 200) {
    resJson.error_message = response.error_message;
  } else {
    resJson.data = response;
  }

  res.json(resJson);
};

const onGetLongLivedAccessToken = async (req, res) => {
  try {
    const response = await get('https://graph.instagram.com/access_token', {
      params: {
        grant_type: req.query.grant_type || 'ig_exchange_token',
        client_secret: req.query.client_secret,
        access_token: req.query.access_token,
      },
      headers: {
        host: 'graph.instagram.com',
      },
    });
    res.json({
      status: 200,
      data: response.data,
      error_message: '',
    });
  } catch (error) {
    const resError = {
      status: 0,
      data: {},
      message: '',
      request: {},
      headers: {},
      config: {},
    };

    if (error.response) {
      resError.status = error.response.status;
      resError.data = error.response.data;
      resError.headers = error.response.headers;
    } else if (error.request) {
      resError.headers = error.request;
    } else {
      resError.message = error.message;
    }

    resError.config = error.config;

    res.json(resError);
  }
};

const onGetMe = async (req, res) => {
  try {
    const response = await get('https://graph.instagram.com/me', {
      params: {
        fields: req.query.fields || 'id, username, media_count, account_type',
        access_token: req.query.access_token,
      },
      headers: {
        host: 'graph.instagram.com',
      },
    });
    res.json({
      status: 200,
      data: response.data,
      error_message: '',
    });
  } catch (error) {
    const resError = {
      status: 0,
      data: {},
      message: '',
      request: {},
      headers: {},
      config: {},
    };

    if (error.response) {
      resError.status = error.response.status;
      resError.data = error.response.data;
      resError.headers = error.response.headers;
    } else if (error.request) {
      resError.headers = error.request;
    } else {
      resError.message = error.message;
    }

    resError.config = error.config;

    res.json(resError);
  }
};

const onGetIgPosts = async (req, res) => {
  try {
    const response = await get(`https://graph.instagram.com/${req.query.user_id || 'me'}/media`, {
      params: {
        fields: req.query.fields || 'id, caption, media_url, media_type, permalink, thumbnail_url, timestamp, username',
        access_token: req.query.access_token,
        limit: req.query.limit || 9,
      },
      headers: {
        host: 'graph.instagram.com',
      },
    });
    res.json({
      status: 200,
      data: response.data.data,
      error_message: '',
    });
  } catch (error) {
    const resError = {
      status: 0,
      data: {},
      message: '',
      request: {},
      headers: {},
      config: {},
    };

    if (error.response) {
      resError.status = error.response.status;
      resError.data = error.response.data;
      resError.headers = error.response.headers;
    } else if (error.request) {
      resError.headers = error.request;
    } else {
      resError.message = error.message;
    }

    resError.config = error.config;

    res.json(resError);
  }
};

app.get('/get-auth-code', onGetAuthCode);
app.post('/get-short-lived-access-token', onGetShortLivedAccessToken);
app.get('/get-long-lived-access-token', onGetLongLivedAccessToken);
app.get('/me', onGetMe);
app.get('/ig-posts', onGetIgPosts);

app.listen(PORT, () => console.log(`Server started on port: ${PORT}`))

const server = new ApolloServer({ typeDefs, resolvers });
server.start().then(() => {
  return server.applyMiddleware({ app });
});

// run the command every two months at 1:00 on the first day of the month
cron.schedule('0 1 1 */2 *', () => {
  console.log("Task is running every two months at 1:00 on the first day of the month " + new Date());
});
