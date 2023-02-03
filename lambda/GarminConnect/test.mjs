import request from 'postman-request'
import qs from 'querystring'
export const handler = async(event) => {
    //Testing to get User ID
    let userID
    const perm_data = ''
        , oauth =
            { consumer_key: 'a82ea843-9675-4410-8cc1-ecdc797fa664'
            , consumer_secret: 't6d6M4iehf2JkKvARALLkTRInpHWINHOXvv'
            , token: '59e056c3-e373-4b6e-9d38-d1d78edcf3c2'
            , token_secret: 'R1LxPb9zHe9TIFo0U2KqmCBcs96QCFA0DkH'
            }
        //, url = 'https://api.twitter.com/1.1/users/show.json'
        , url = 'https://oauth.net/core/1.0a/#signing_process'
        , data =
            { screen_name: perm_data.screen_name
            , user_id: perm_data.user_id
            }
        ;
    request.get({url:'https://apis.garmin.com/wellness-api/rest/user/id', oauth:oauth, qs:data, json:true}, function (e, r, user) {
        console.log("User ID is "+user.userId)
        //userID = user.userid
    })

    // TODO implement
    const response = {
        statusCode: 200,
        body: "Success!"
    };
    return response;
};
//let response = exports.handler({'a':'b'})
let response = handler({'a':'b'})
// passes this reponse to the calling server.
console.log(response)