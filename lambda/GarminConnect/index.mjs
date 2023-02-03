import request from 'postman-request'
import qs from 'querystring'
//exports.handler = async(event, context) => {
export const handler = async(event, context) => {
    // Do all the hardwork for the Oauth Step 1 and Step 2 here.
    //Step 1 - Get Request Token
    //const request = require('postman-request');
    //const qs = require('querystring')
    //, oauth
    let oauth =
        { callback: ''
        , consumer_key: 'a82ea843-9675-4410-8cc1-ecdc797fa664'
        , consumer_secret: 't6d6M4iehf2JkKvARALLkTRInpHWINHOXvv'
        }
    , url = 'https://connectapi.garmin.com/oauth-service/oauth/request_token'
    ;
    request.post({url:url, oauth:oauth}, function (e, r, body) {
    // Ideally, you would take the body in the response
    // and construct a URL that a user clicks on (like a sign in button).
    // The verifier is only available in the response after a user has
    // verified with twitter that they are authorizing your app.

    //Step 2 - Get OAuth Verifier
    const req_data = qs.parse(body)
    console.log(req_data.oauth_token);
    console.log(req_data.oauth_token_secret);
    const uri = 'https://connect.garmin.com/oauthConfirm'
        + '?' + qs.stringify({oauth_token: req_data.oauth_token})
    //Redirect the user to the authorize uri
    const response = {
        statusCode: 303,
        headers : {
            "Location": "https://connect.garmin.com/oauthConfirm?oauth_token="+req_data.oauth_token
        }
    };
    return response;
    })


    // Store the oauth token from step 2 in this variable, which will then be added to the 303 redirect.
    //let oauthToken = "df0cb352-c12a-4881-9875-dbb0d91e18a0"

	//console.log('calling this lambda function')
    
};

//let response = exports.handler({'a':'b'})
let response = handler({'a':'b'})
// passes this reponse to the calling server.
console.log(response)
