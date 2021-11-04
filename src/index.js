const express = require('express');
const cors = require('cors');
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

app.listen(PORT, () => console.log(`Server started on port: ${PORT}`))

const server = new ApolloServer({ typeDefs, resolvers });
server.start().then(() => {
  return server.applyMiddleware({ app });
});