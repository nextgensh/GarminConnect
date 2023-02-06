import request from 'postman-request'
import qs from 'querystring'
export const handler = async(event) => {
    /*
    let body = event['body']
    let params = event['queryStringParameters']
    let oauth_token = params['oauth_token']
    let oauth_verifier = params['oauth_verifier']
    */
    let access_token = ''
    let access_token_secret = ''
    let userID = ''
    //If this fails you may need to find a way to parse the token secret from index.mjs to here
    //Just confirmed, token secret is necessary
    
    // Making more requests to return the user access token.
    //Step 3 - Get Access Token
    //const request = require('postman-request');
    //const qs = require('querystring')
    //After the user is redirected back to the server
    console.log("Here");
    //qs.parse(body)
    const auth_data = ''
        , oauth =
        { consumer_key: 'a82ea843-9675-4410-8cc1-ecdc797fa664'
        , consumer_secret: 't6d6M4iehf2JkKvARALLkTRInpHWINHOXvv'
        //, token: auth_data.oauth_token
        //, token_secret: req_data.oauth_token_secret
        //, verifier: auth_data.oauth_verifier
        //, token: oauth_token
        , token: '6a3af601-501a-439c-85bf-5c779a150c04'
        //, token_secret: 'oauth_token_secret'
        , token_secret: 'Ua5N22ZHUpfKkxS6JJES0c25HH8LDlVDJ8W'
        //, verifier: oauth_verifier
        , verifier: 'haH1R2tFf0'
        }
        , url = 'https://connectapi.garmin.com/oauth-service/oauth/access_token'
        ;
    request.post({url:url, oauth:oauth}, function (e, r, body) {
        // ready to make signed requests on behalf of the user
        //change
        const perm_data = qs.parse(body)
        , oauth =
            { consumer_key: 'a82ea843-9675-4410-8cc1-ecdc797fa664'
            , consumer_secret: 't6d6M4iehf2JkKvARALLkTRInpHWINHOXvv'
            , token: perm_data.oauth_token
            , token_secret: perm_data.oauth_token_secret
            }
        //, url = 'https://api.twitter.com/1.1/users/show.json'
        , url = 'https://oauth.net/core/1.0a/#signing_process'
        , data =
            { screen_name: perm_data.screen_name
            , user_id: perm_data.user_id
            }
        ;
        access_token = perm_data.oauth_token
        access_token_secret = perm_data.oauth_token_secret
        console.log(access_token);
        console.log(access_token_secret);
        //console.log(perm_data.screen_name);
        //console.log(perm_data.user_id);
        //res.status(201).json({ success: true })
        //request.get({url:url, oauth:oauth, qs:data, json:true}, function (e, r, user) {
        request.get({url:'https://apis.garmin.com/wellness-api/rest/user/id', oauth:oauth, qs:data, json:true}, function (e, r, user) {
            console.log(user)
            userID = user.userId
        })
    })
    // TODO implement
    const response = {
        statusCode: 200,
        body: "Access Token is "+access_token+" and User ID is "+userID
    };
    return response;
};
//let response = exports.handler({'a':'b'})
let response = handler({'a':'b'})
// passes this reponse to the calling server.
console.log(response)