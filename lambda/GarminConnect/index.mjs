import request from 'postman-request'
import qs from 'querystring'
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";
/*
 * @description : Method which gets the OAuth token from Garmin.
 * @params:
 *          url : The url of the Garmin endpoint.
 *          oauth : The OAuth configuration object.
 * @returns:
 *          Promise with the garmin oauth tokens / error.
 */
function getOAuthToken (url, oauth) {
    return new Promise(function (resolve, reject) {
            request.post({url:url, oauth:oauth}, function (e, r, body) {
                // Ideally, you would take the body in the response
                // and construct a URL that a user clicks on (like a sign in button).
                // The verifier is only available in the response after a user has
                // verified with twitter that they are authorizing your app.

                //Step 2 - Get OAuth Verifier
                const req_data = qs.parse(body)
                const oauth_token = req_data.oauth_token
                const oauth_token_secret = req_data.oauth_token_secret
                if(oauth_token){
                    resolve({
                        'participantId': 'MDH-001',
                        'oauth_token' : oauth_token,
                        'oauth_token_secret' : oauth_token_secret
                    })
                }
                else{
                    reject("It did NOT work!")
                }
            })
    })
}

export const handler = async(event, context) => {
    const client = new DynamoDBClient({ region: "us-east-1" });
    const ddbDocClient = DynamoDBDocumentClient.from(client);
    //Step 1 - Get Request Token
    //TODO: Move this to AWS Secrets Manager.
    
    let oauth =
        { callback: '' ,
          consumer_key: 'a82ea843-9675-4410-8cc1-ecdc797fa664',
          consumer_secret: 't6d6M4iehf2JkKvARALLkTRInpHWINHOXvv'
        }

    let url = 'https://connectapi.garmin.com/oauth-service/oauth/request_token';

    const result = await getOAuthToken(url, oauth)
    
    if(result == "It did NOT work!"){
        //Print Error To Website
        let response = {
            statusCode: 500,
        };
        return response;
    }
    
    const oauth_token = result['oauth_token']
    const oauth_token_secret = result['oauth_token_secret']

    /*
     * TODO: Add the oauth_token_secret to a dynamodb database for temp storage if it is needed for future use.
     */
    
    const dB = await ddbDocClient.send(
      new PutCommand({
        "TableName": "garminconnect",
        "Item": result,
      })
    );

    let response = {
        statusCode: 303,
        headers : {
            "Location": "https://connect.garmin.com/oauthConfirm?oauth_token="+oauth_token
        }
    };

    return response
};

//let response = exports.handler({'a':'b'})
let response = handler({'a':'b'})
// passes this reponse to the calling server.
console.log(response)
