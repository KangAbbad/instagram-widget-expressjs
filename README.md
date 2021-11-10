# HOW TO USE INSTAGRAM WIDGET

## Create a Facebook developer account

To create a Facebook developer account visit [facebook developer page](https://developers.facebook.com/) and sign up

## Create an App

To consume the Instagram API, we will need to have created an app. The following steps:

1. From your dashboard page, in the apps section, click the *Create App* button.
2. In the resulting pop-up, select Consumer and then click Continue.
3. Enter your App Display Name and then click Create App.
4. In the resulting page, in the products section, on the *Instagram Basic Display* product click Set Up.
5. On the following page, read through the information provided and then click *Create App* down below. Confirm the name of the app in the resulting pop-up.
6. In the resulting page, we will need to add some valid URLs in the entries provided. For this article, we will use [httpstat.us](https://httpstat.us). It’s a service for generating HTTP Status Codes based on the nature of the request.

    For example, a [https://httpstat.us/200](https://httpstat.us/200) will return a 200 status code.

    Just fill the following field with [https://httpstat.us/200](https://httpstat.us/200):

    - Client OAuth Settings -> Valid OAuth Redirect URIs
    - Deauthorized -> Deauthorized Callback URL
    - Data Deletion Requests -> Data Deletion Requests URL

7. In the App Review for Instagram Basic Display section, hit Add to Submission for instagram_graph_user_profile_and_instagram_graph_user_media to be able to access Instagram’s user profile and media.

## Adding an Instagram test user

To use the Instagram basic display API in development, we will have to add a test user. To do so, we will follow the following steps:

1. In the left sidebar, click on *Roles* and then *Roles*.
2. Scroll to the bottom, and hit the *Add Instagram Testers*
3. In the resulting pop-up, enter the username of the Instagram account you are going to use throughout the article. Make sure it’s an Instagram account you can log in to because you will be required to accept the request sent.
4. On hitting *Submit*, the account will appear in the section with a `Pending` text attached to it. The owner of the Instagram account is supposed to accept it first to be complete.
5. Log in to that particular Instagram account you have entered its username using **Desktop Browser**.
6. In the *settings* section, find *Apps and Websites*. In the resulting section, click on the **TESTER INVITES** tab. Click on the **Accept** button.

## Setting up the project

1. Clone the Repository and do npm install
2. Create .env file for accessing the environmental variables
3. Open your facebook developer dashboard then copy *Instagram App Id* and also *Instagram App Secret*

    Edit your .env file by adding the following:

    ```go
      INSTAGRAM_APP_ID=your_instagram_app_id
      INSTAGRAM_APP_SECRET=your_instagram_app_secret
      REDIRECT_URI=https://httpstat.us/200
      AUTHORIZATION_CODE=
      SHORT_LIVED_AT=
      LONG_LIVED_AT=
    ```

## Getting the authorization code

1. From your web browser, open `http:localhost:4000/get-auth-code`. In there, click the link Connect to Instagram to connect to your Instagram account.
2. In the resulting pop-up, click *Allow*, after which you will be redirected to a different page. On this new page, in the URL section, we have a code parameter which is as below for example:

    ```md
    https://httpstat.us/200?code=AQAxeSr9DVqvZH_HLztDHS-fpY6L8kOTOBkZrDIYAT6l64wGwbuD8XA9DJo_oFaWZUHb1iqANhBpngqzV3nigbikLC3BCxF7h-wGjhLDT92m7oGlnc5WM...#_
    ```

    Copy the entire value of code parameter up to where we have #. Don’t include the #. Paste the code to your .env file on **AUTHORIZATION_CODE** variable.

## Getting the short-lived access token

Short-lived access tokens are valid for 1 hour.

1. From your browser, visit: `http://localhost:4000/graphql`.
2. Hit on *Query your server* and go to [apollographql sandbox](https://studio.apollographql.com/sandbox/explorer?endpoint=http://localhost:4000/graphql).
3. On the code editor, write the following query:

    ```go
    query GetShortToken{
      getShortLivedAccessToken{
        access_token
        user_id
      }
    }
    ```

4. Hit the play button.
5. Observe the results. If you get an error of invalid *client secret* and *code* or that your *authorization code* has expired, revisit the **previous step** and restart the server manually by pressing `ctrl + c` to stop it and then `npm run dev` to start it.
6. Your response should be similar to:

    ```json
    {
      "data": {
        "getShortLivedAccessToken": {
          "access_token": "IGQVJXT3dmME...",
          "user_id": 178414321320034975
        }
      }
    }
    ```

7. Copy the **access_token** value from the response to your `.env` file on **SHORT_LIVED_AT** variable.

## Getting the long-lived access token

Long-lived access tokens are valid for 60 days.

1. From your browser, visit: `http://localhost:4000/graphql`.
2. Hit on *Query your server* and go to [apollographql sandbox](https://studio.apollographql.com/sandbox/explorer?endpoint=http://localhost:4000/graphql).
3. On the code editor, write the following query:

    ```go
    query GetLongLivedToken {
      getLongLivedAccessToken{
        access_token
        token_type
        expires_in
      }
    }
    ```

4. Hit the play button.
5. Observe the results. If you get an error of invalid *client secret* and *code* or that your *authorization code* has expired, revisit the **previous step** and restart the server manually by pressing `ctrl + c` to stop it and then `npm run dev` to start it.
6. Your response should be similar to:

    ```json
    {
      "data": {
        "getLongLivedAccessToken": {
          "access_token": "IGQVJYbnYzaEpTQjBfaTFGR...",
          "token_type": "bearer",
          "expires_in": 51682283
        }
      }
    }
    ```

7. Copy the **access_token** value from the response to your `.env` file on **LONG_LIVED_AT** variable.

## Available API

### **[GET] get-auth-code**

```html
http://localhost:4000/get-auth-code
```

### **[POST] get-short-lived-access-token**

```html
http://localhost:4000/get-short-lived-access-token
```

### **[GET] get-long-lived-access-token**

```html
http://localhost:4000/get-long-lived-access-token
```

### **[GET] me**

```html
http://localhost:4000/me
```

### **[GET] ig-posts**

```html
http://localhost:4000/ig-posts
```
