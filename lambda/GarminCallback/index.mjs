import request from 'postman-request'
import qs from 'querystring'
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand, GetCommand, UpdateCommand } from "@aws-sdk/lib-dynamodb";

function getAccessToken (url, oauth) {
    return new Promise(function (resolve, reject) {
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
            let access_token = perm_data.oauth_token
            let access_token_secret = perm_data.oauth_token_secret
            console.log(access_token);
            console.log(access_token_secret);

            if(access_token){
                resolve({
                    'access_token' : access_token,
                    'access_token_secret' : access_token_secret,
                    'oauth': oauth,
                    'data': data
                })
            }
            else{
                reject("It did NOT work!")
            }
        })
    })
}

function getUserId (oauth, data) {
    return new Promise(function (resolve, reject) {
        request.get({url:'https://apis.garmin.com/wellness-api/rest/user/id', oauth:oauth, qs:data, json:true}, function (e, r, user) {
            console.log(user)
            //userID = user.userId
            if(user){
                resolve({
                    'userid' : user.userId,
                })
            }
            else{
                reject("User ID did NOT work!")
            }
        })
    })
}

export const handler = async(event) => {
    const client = new DynamoDBClient({ region: "us-east-1" });
    const ddbDocClient = DynamoDBDocumentClient.from(client);
    
    let body = event['body']
    let params = event['queryStringParameters']
    let oauth_token = params['oauth_token']
    let oauth_verifier = params['oauth_verifier']
    let user
    
    //Get User fro GarminConnect DB
    const getUser = await ddbDocClient.send(
        new GetCommand({
          "TableName": "garminconnect",
          "Key": {
            'participantId': 'MDH-001'
          },
          // For this use case, the data does not changed often so why not get the
          // reads at half the cost? Your use case might be different and need true.
          "ConsistentRead": false,
        })
    )
    user = getUser['Item']
    
    // Making more requests to return the user access token.
    const oauth = { 
            consumer_key: 'a82ea843-9675-4410-8cc1-ecdc797fa664',
            consumer_secret: 't6d6M4iehf2JkKvARALLkTRInpHWINHOXvv',
            token: user.oauth_token,
            token_secret: user.oauth_token_secret,
            verifier: oauth_verifier
        }
    const url = 'https://connectapi.garmin.com/oauth-service/oauth/access_token';
    
    const result = await getAccessToken(url, oauth)
    const access_token = result['access_token']
    const access_token_secret = result['access_token_secret']
    const newOauth = result['oauth']
    const data = result['data']

    const printUserId = await getUserId(newOauth, data)
    const userID = printUserId['userid']

    console.log(access_token)
    console.log(userID)
    
    const dB = await ddbDocClient.send(
      new PutCommand({
        "TableName": "garminconnect",
        "Item": {
            'participantId': 'MDH-001',
            'oauth_token' : access_token,
            'oauth_token_secret' : access_token_secret,
            'userID' : userID
        },
      })
    );
    
    // TODO implement
    const response = {
        statusCode: 200,
        //body: "Token is "+oauth_token+" and verifier is "+oauth_verifier
        body: "Access Token is "+access_token+" and userID is "+userID
        //body: "Verifier is "+user['oauth_token_secret']
    };
    return response;
};

//let response = exports.handler({'a':'b'})
let response = handler({'a':'b'})
// passes this reponse to the calling server.
console.log(response)
