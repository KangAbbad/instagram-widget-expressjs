const express = require('express');
const cors = require('cors');
const { get } = require('axios').default;
const { ApolloServer } = require('apollo-server-express');
require('dotenv').config();

const typeDefs = require('./schema');
const resolvers = require('./resolvers');

const PORT = process.env.PORT || 4000;

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get('/get-auth-code', (req, res, next) => {
  return res.send(`<a href='https://api.instagram.com/oauth/authorize?client_id=${process.env.INSTAGRAM_APP_ID}&redirect_uri=${process.env.REDIRECT_URI}&scope=user_media,user_profile&response_type=code'> Connect to Instagram </a>`);
});

app.get('/me', async (req, res) => {
  try {
    const response = await get('https://graph.instagram.com/me', {
      params: {
        fields: 'id, username, media_count, account_type',
        access_token: process.env.LONG_LIVED_AT,
      },
      headers: {
        host: 'graph.instagram.com',
      },
    });
    res.send(response.data);
  } catch (error) {
    res.send(error);
  }
});

app.get('/me/posts', async (req, res) => {
  try {
    const response = await get('https://graph.instagram.com/me/media', {
      params: {
        fields: 'id, caption, media_url, media_type, permalink, thumbnail_url, timestamp, username',
        access_token: process.env.LONG_LIVED_AT,
      },
      headers: {
        host: 'graph.instagram.com',
      },
    });
    res.send(response.data);
  } catch (error) {
    res.send(error);
  }
});

app.listen(PORT, () => console.log(`Server started on port: ${PORT}`))

const server = new ApolloServer({ typeDefs, resolvers });
server.start().then(() => {
  return server.applyMiddleware({ app });
});