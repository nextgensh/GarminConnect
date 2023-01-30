exports.handler = async(event, context) => {
    // Do all the hardwork for the Oauth Step 1 and Step 2 here.
    
    // Store the oauth token from step 2 in this variable, which will then be added to the 303 redirect.
    let oauthToken = "df0cb352-c12a-4881-9875-dbb0d91e18a0"

	//console.log('calling this lambda function')
    
    const response = {
        statusCode: 303,
        headers : {
            "Location": "https://connect.garmin.com/oauthConfirm?oauth_token="+oauthToken+"&oauth_callback=https://apis.garmin.com/tools/oauthAuthorizeUser?action=step3"
        }
    };
    return response;
};

//let response = exports.handler({'a':'b'})
// passes this reponse to the calling server.
//console.log(response)
