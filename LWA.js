const axios = require('axios');
let data = JSON.stringify({
    "grant_type": "refresh_token",
    "refresh_token": "YOUR_REFRESH_TOKEN",
    "client_id": "YOUR_CLIENT_ID",
    "client_secret": "YOUR_CLIENT_SECRET"
});

let config = {
    method: 'post',
    maxBodyLength: Infinity,
    url: 'https://api.amazon.com/auth/o2/token',
    headers: {
        'Content-Type': 'application/json'
    },
    data: data
};

axios.request(config)
    .then((response) => {
        console.log(JSON.stringify(response.data));
    })
    .catch((error) => {
        console.log(error);
    });

// {
//     "access_token": "access_token",
//     "refresh_token": "refresh_token",
//     "token_type": "bearer",
//     "expires_in": 3600
// }