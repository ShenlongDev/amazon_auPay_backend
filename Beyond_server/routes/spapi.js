const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken')
const config = require('../configs/jwt-config')
const ensureAuthenticated = require('../modules/ensureAuthenticated')
var bcrypt = require('bcryptjs');
const { Op } = require('sequelize');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
require('dotenv').config();
const twilio = require('twilio');
const axios = require('axios');


const sendEmail = require('../emailService');
const { User, AsinList, WhiteAsin, ExcludeWords, EditPrice } = require("../models");

async function spapi_token(YOUR_REFRESH_TOKEN, YOUR_CLIENT_ID, YOUR_CLIENT_SECRET) {
    let data = JSON.stringify({
        "grant_type": "refresh_token",
        "refresh_token": YOUR_REFRESH_TOKEN,
        "client_id": YOUR_CLIENT_ID,
        "client_secret": YOUR_CLIENT_SECRET
    });
    console.log("data", data);

    let config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: 'https://api.amazon.com/auth/o2/token',
        headers: {
            'Content-Type': 'application/json'
        },
        data: data
    };

    try {
        const response = await axios.request(config);
        console.log(JSON.stringify(response.data));
        return response.data;
    } catch (error) {
        console.log(error);
        throw new Error("Error fetching token");
    }
}

router.post('/test', async function (req, res, next) {
    // return res.status(200).json({ message: 'checking token' });
    const params = req.body;
    try {
        // Assuming the Bearer token is sent in the Authorization header
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];
        const decoded = jwt.verify(token, config.secret);
        const email = decoded.email;

        if (!token) {
            return res.status(401).json({ message: 'No token provided' });
        }

        const userinfo = await User.findOne({
            where: { email: email }
        }).then(async user => {
            if (!user) {
                return next(err);
            }

            const spToken = await spapi_token(user.account_sp_api_refresh_token, user.account_sp_api_client_id, user.account_sp_api_client_secret);
            console.log("test", spToken);
            return res.status(200).json({ message: spToken });

        })
            .catch(err => {
                return next(err);
            })


    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error processing token' });
    }

})

function convertToArray(input) {
    return input.split(/\s+/).filter(Boolean);
}
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
router.post('/additemFromAsin', async function (req, res, next) {
    // return res.status(200).json({ message: 'checking token' });
    const params = req.body;
    try {
        // Assuming the Bearer token is sent in the Authorization header
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];
        const decoded = jwt.verify(token, config.secret);
        const email = decoded.email;

        if (!token) {
            return res.status(401).json({ message: 'No token provided' });
        }

        const userinfo = await User.findOne({
            where: { email: email }
        }).then(async user => {
            if (!user) {
                return next(err);
            }

            const spToken = await spapi_token(user.account_sp_api_refresh_token, user.account_sp_api_client_id, user.account_sp_api_client_secret);
            console.log("test", spToken);

            let asinAry = convertToArray(params.asin_list);
            // let amazonAry =[];

            for (let i = 0; i < asinAry.length; i++) {

                console.log("response", i);

                const options = {
                    method: 'GET',
                    url: 'https://sellingpartnerapi-fe.amazon.com/catalog/v0/items/' + asinAry[i] + '?MarketplaceId=A1VC38T7YXB528',
                    headers: {
                        'x-amz-access-token': spToken.access_token,
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + spToken.access_token
                    }
                };

                const response = await axios.request(options);
                console.log("response", response.data.payload.AttributeSets);

                try {
                    const asin = await AsinList.findOne({
                        where: { asin: asinAry[i] }
                    });

                    const attributeSets = response.data.payload.AttributeSets;

                    if (attributeSets && attributeSets.length > 0) {
                        const firstAttributeSet = attributeSets[0];

                        const title = firstAttributeSet.Title; // Title
                        const brand = firstAttributeSet.Brand; // Brand
                        const listPrice = firstAttributeSet.ListPrice; // ListPrice

                        // Check if ListPrice exists before accessing Amount
                        const price = listPrice ? listPrice.Amount : null; // Handle potential undefined

                        if (!asin) {
                            // Create a new ASIN entry
                            const asin_info = new AsinList();
                            asin_info.user_id = params.userId;
                            asin_info.asin = asinAry[i];
                            asin_info.name = title;
                            asin_info.brand = brand;
                            asin_info.price = price;
                            asin_info.img = firstAttributeSet.SmallImage.URL;
                            asin_info.status = "";
                            asin_info.amazon_link = `https://www.amazon.co.jp/dp/${asinAry[i]}?th=1`;

                            await asin_info.save(); // Await the save operation
                        } else {
                            // Update the existing ASIN entry
                            asin.name = title;
                            asin.brand = brand;
                            asin.price = price;
                            asin.img = firstAttributeSet.SmallImage.URL;
                            asin.status = "";
                            asin.amazon_link = `https://www.amazon.co.jp/dp/${asinAry[i]}?th=1`;

                            await asin.save(); // Await the save operation
                        }
                    } else {
                        console.error("AttributeSets is undefined or empty");
                    }
                } catch (error) {
                    console.error("Error occurred:", error);
                    // Handle the error appropriately (e.g., return an error response)
                }


                await sleep(2000);
                // user_id,asin,name,brand,price,img,status:,amazon_link,
                // amazonAry.push(response.data.payload.AttributeSets);

            }

            console.log("response", "Ok");

            return res.status(200).json({ message: "Ok" });

        })
            .catch(err => {
                return next(err);
            })


    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error processing token' });
    }

})
module.exports = router;

