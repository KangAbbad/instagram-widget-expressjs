const { gql } = require('apollo-server-express');

const ShortLivedAccessToken = gql`
  type ShortLivedAccessToken {
    access_token: String!
    user_id: Float!
  }
`;

const LongLivedAccessToken = gql`
  type LongLivedAccessToken {
    access_token: String!
    token_type: String!
    expires_in: Float!
  }
`;

const ProfileData = gql`
  type ProfileData {
    account_type: String!
    id: String!
    media_count: Int!
    username: String!
  }
`;

const MediaData = gql`
  scalar Date
  type MediaData {
    caption: String
    id: String
    media_type: String
    media_url: String
    permalink: String
    thumbnail_url: String
    timestamp: Date
    username: String
  }
`;

const Query = gql`
  type Query {
    getShortLivedAccessToken: ShortLivedAccessToken
    getLongLivedAccessToken: LongLivedAccessToken
    getProfileData: ProfileData
    getUserMediaData: [MediaData]
  }
`;

module.exports = [
  ShortLivedAccessToken,
  LongLivedAccessToken,
  ProfileData,
  MediaData,
  Query,
];
