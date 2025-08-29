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
const { User, BlackBuyer, WhiteAsin, ExcludeWords, EditPrice } = require("../models");


const multer = require('multer');
var path = require('path');

const TypedError = require('../modules/ErrorHandler')

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, 'public/uploads/');
  },
  filename: (req, file, callback) => {
    callback(null, `${Date.now()}-${file.originalname}`);
  },
});
const upload = multer({ storage: storage });

const stripe = require('stripe')('sk_test_51QMoCoK7S11jMD7Jcv5KDq2rBGEahS3pD3Di2zjHHsIrIFfW6xHhtLGWNqkobJfAGsBuhsWF3xK3jqlEk3xlbjfi00s7rqbNMp');

function randomString(length) {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    result += characters[randomIndex];
  }
  return result;
}

router.post('/register', async function (req, res, next) {

  let _user = req.body;
  req.checkBody('first_name', 'FirstName is required').notEmpty();
  req.checkBody('last_name', 'LastName is required').notEmpty();
  req.checkBody('email', 'Email is required').notEmpty();
  req.checkBody('password', 'Password is required').notEmpty();

  req.checkBody('email', 'mail error').isEmail();

  let invalidFieldErrors = req.validationErrors();

  if (invalidFieldErrors) {
    return res.json({ error: "mail_type_error" });
  }

  User.findOne({ where: { email: _user.email } })
    .then(async (user) => {


      if (user) {
        return res.json({ error: "mail_two_error" });

      } else {

        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(_user.password, saltRounds);
        _user.password = hashedPassword;

        let token = jwt.sign(

          { email: _user.email },
          config.secret,
          { expiresIn: '1h' }

        )
        console.log(hashedPassword);

        User.create({ ..._user, _token: token })
          .then(user => {
            return res.json({
              user_id: user.id,
              user_name: user.first_name + ' ' + user.last_name,
              token: token,
              role: "user",
              expire_in: '1h',
              point: 0,
              first_name: user.first_name,
              last_name: user.last_name,
              email: user.email,
              invite_send_code: randomString(10)
            });
          })
          .catch(err => {
            return res.json({ error: "mail_add_error" });
          });
        //   });
        // });
      }
    })
    .catch(err => {
      console.log(err);
      return res.json({ error: "mail_edit_error" });
    })
});

router.post('/login', async function (req, res, next) {
  const { email, password } = req.body || {};
  if (!email || !password) {
    let err = new TypedError('login error', 400, 'missing_field', { message: "missing email or password" });
    return next(err);
  }
  await User.findOne({ where: { email: email } })
    .then(user => {
      if (!user) {
        let err = new TypedError('login error', 403, 'invalid_field', { message: "Incorrect email or password" });
        return next(err);
      }
      bcrypt.compare(password, user.password, function (err, isMatch) {
        if (err) console.log(err);
        if (isMatch) {
          let token = jwt.sign(
            { email: email },
            config.secret,
            { expiresIn: '1h' }
          )
          res.status(201).json({
            user_id: user.id,
            first_name: user.first_name,
            last_name: user.last_name,
            avatar: user.avatar,
            email: user.email,
            token: token,
            role: user.role,
            expire_in: '1h',
            point: user.point,
            deposit: user.deposit,
            invite_send_code: user.invite_send_code,
            mile: user.mile,
            is_receiving: user.is_receiving
          })
        }
        else {
          let err = new TypedError('login error', 403, 'password_not_match', { message: "Incorrect  password" })
          return next(err)
        }
      });
    })
    .catch(err => {
      return next(err);
    })
})

router.post('/imguload', upload.array('file'), async function (req, res, next) {
  console.log(req.headers)

  if (!req.files) {
    return res.status(400).send('No files were uploaded.');
  }
  res.status(200).json({ files: req.files });

})

router.post('/imgInitSave', async function (req, res, next) {

  try {
    // Assuming the Bearer token is sent in the Authorization header
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const decoded = jwt.verify(token, config.secret);
    const email = decoded.email;
    const params = req.body;

    await User.findOne({ where: { email: email } })
      .then(user => {
        if (!user) {
          return res.status(401).json({ message: 'No token provided' });

        } else {
          user.img_init_agree = params.img_init_agree;
          user.img_init_config = params.img_init_config;
          user.img_init_url = params.img_init_url;
          user.save();

          res.json({ params });

        }

      });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error processing token' });
  }
})

router.post('/imgAccountSave', async function (req, res, next) {

  try {
    // Assuming the Bearer token is sent in the Authorization header
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const decoded = jwt.verify(token, config.secret);
    const email = decoded.email;
    const params = req.body;

    await User.findOne({ where: { email: email } })
      .then(user => {
        if (!user) {
          return res.status(401).json({ message: 'No token provided' });

        } else {
          user.img_init_agree = params.img_init_agree;
          user.img_init_config = params.img_init_config;
          user.img_init_url = params.img_init_url;

          user.account_company_info = params.account_company_info;
          user.account_au_api = params.account_au_api;
          user.account_au_api_auto_update = params.account_au_api_auto_update;
          user.account_sp_api_client_id = params.account_sp_api_client_id;
          user.account_sp_api_client_secret = params.account_sp_api_client_secret;

          user.account_sp_api_application_id = params.account_sp_api_application_id;
          user.account_sp_api_refresh_token = params.account_sp_api_refresh_token;
          user.account_stock = params.account_stock;
          user.account_fba_count = params.account_fba_count;
          user.account_store = params.account_store;

          user.account_mail = params.account_mail;
          user.account_mail_contact = params.account_mail_contact;
          user.account_mail_head = params.account_mail_head;
          user.account_mail_txt = params.account_mail_txt;
          user.account_delivery = params.account_delivery;

          user.account_mail_server = params.account_mail_server;
          user.account_img_count = params.account_img_count;
          user.account_au_api_expiry_date = params.account_au_api_expiry_date;

          user.save();

          res.json({ params });

        }

      });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error processing token' });
  }
})

router.post('/getinfo', async function (req, res, next) {

  try {
    // Assuming the Bearer token is sent in the Authorization header
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const decoded = jwt.verify(token, config.secret);
    const email = decoded.email;

    await User.findOne({ where: { email: email } })
      .then(user => {
        if (!user) {
          return res.status(401).json({ message: 'No token provided' });
        } else {
          res.json({ user });
        }

      });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error processing token' });
  }
})


router.post('/getbuyer', async function (req, res, next) {
  const params = req.body;
  try {
    // Assuming the Bearer token is sent in the Authorization header
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const decoded = jwt.verify(token, config.secret);
    const email = decoded.email;

    await BlackBuyer.findAll({ where: { user_id: params.userId } })
      .then(user => {
        if (!user) {
          return res.status(401).json({ message: 'No token provided' });
        } else {
          res.json({ user });
        }

      });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error processing token' });
  }
})

router.post('/getbuyeradd', async function (req, res, next) {
  const params = req.body;
  try {
    // Assuming the Bearer token is sent in the Authorization header
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }
    const params = req.body;

    let blackbuyer = new BlackBuyer
    blackbuyer.user_id = params.user_id;
    blackbuyer.name = params.name;
    blackbuyer.phone = params.phone;
    blackbuyer.address = params.address;
    blackbuyer.email = params.email;

    blackbuyer.save();

    res.json({ blackbuyer });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error processing token' });
  }
})

router.post('/getbuyerupdate', async function (req, res, next) {
  const params = req.body;
  try {
    // Assuming the Bearer token is sent in the Authorization header
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      let blackbuyer = new BlackBuyer
      blackbuyer.user_id = params.user_id;
      blackbuyer.name = params.name;
      blackbuyer.phone = params.phone;
      blackbuyer.address = params.address;
      blackbuyer.email = params.email;

      blackbuyer.save();
    }
    const params = req.body;

    await BlackBuyer.findOne({ where: { id: params.sel_id } })
      .then(blackbuyer => {
        if (!blackbuyer) {
          return res.status(401).json({ message: 'No token provided' });

        } else {

          blackbuyer.name = params.name;
          blackbuyer.phone = params.phone;
          blackbuyer.address = params.address;
          blackbuyer.email = params.email;

          blackbuyer.save();

          res.json({ blackbuyer });

        }

      });


  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error processing token' });
  }
})

router.post('/getbuyerdel', async function (req, res, next) {
  const params = req.body;
  try {
    // Assuming the Bearer token is sent in the Authorization header
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const result = await BlackBuyer.destroy({
      where: {
        id: params.sel_id
      }
    });
    console.log('Row deleted:', result);

    res.json({ result });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error processing token' });
  }
})

router.post('/getbuyerall', async function (req, res, next) {
  const params = req.body;

  try {
    // Assuming the Bearer token is sent in the Authorization header
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const result = await BlackBuyer.destroy({
      where: {
        id: params.sels
      }
    });
    console.log('Row deleted:', result);

    res.json({ result });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error processing token' });
  }
})

// White ASIN
router.post('/getwhiteasin', async function (req, res, next) {
  const params = req.body;
  try {
    // Assuming the Bearer token is sent in the Authorization header
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const decoded = jwt.verify(token, config.secret);
    const email = decoded.email;

    const page = params.page || 1;
    const pageSize = params.pageSize || 10;
    const offset = (page - 1) * pageSize;

    const totalCount = await WhiteAsin.count({ where: { user_id: params.userId } });

    const whiteasin = await WhiteAsin.findAll({
      where: { user_id: params.userId },
      limit: pageSize,
      offset: offset,
    });

    res.json({
      totalCount: totalCount,
      whiteasin: whiteasin,
      currentPage: page,
      pageSize: pageSize,
    });


  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error processing token' });
  }
})

router.post('/getwhiteasindel', async function (req, res, next) {
  const params = req.body;
  try {
    // Assuming the Bearer token is sent in the Authorization header
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const result = await WhiteAsin.destroy({
      where: {
        id: params.sel_id
      }
    });
    console.log('Row deleted:', result);

    res.json({ result });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error processing token' });
  }
})
router.post('/getwhiteasinsel', async function (req, res, next) {
  const params = req.body;

  try {
    // Assuming the Bearer token is sent in the Authorization header
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const result = await WhiteAsin.destroy({
      where: {
        id: params.sels
      }
    });
    console.log('Row deleted:', result);

    res.json({ result });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error processing token' });
  }
})

router.post('/getwhiteasinall', async function (req, res, next) {
  const params = req.body;

  try {
    // Assuming the Bearer token is sent in the Authorization header
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const result = await WhiteAsin.destroy({
      where: {
        user_id: params.user_id
      }
    });

    console.log('Row deleted:', result);

    res.json({ result });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error processing token' });
  }
})

function convertToArray(input) {
  return input.split(/\s+/).filter(Boolean);
}
router.post('/getwhiteasinadd', async function (req, res, next) {
  const params = req.body;
  try {
    // Assuming the Bearer token is sent in the Authorization header
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }
    const params = convertToArray(req.body.asin);

    for (const item of params) {
      await WhiteAsin.create({ asin: item, user_id: req.body.user_id });
    }

    res.json({ params });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error processing token' });
  }
})

//=============================================================
//  設定管理 / 除外ワード設定
//=============================================================
function convertToArray_(input) {
  return input.split(/\n+/).filter(Boolean);
}
router.post('/getexcludewords', async function (req, res, next) {
  const params = req.body;
  try {
    // Assuming the Bearer token is sent in the Authorization header
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const decoded = jwt.verify(token, config.secret);
    const email = decoded.email;

    const page = params.page || 1;
    const pageSize = params.pageSize || 10;
    const offset = (page - 1) * pageSize;

    const totalCount = await ExcludeWords.count({ where: { user_id: params.userId } });

    const word = await ExcludeWords.findAll({
      where: { user_id: params.userId },
      limit: pageSize,
      offset: offset,
    });

    res.json({
      totalCount: totalCount,
      whiteasin: word,
      currentPage: page,
      pageSize: pageSize,
    });


  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error processing token' });
  }
})

router.post('/excludewordsdel', async function (req, res, next) {
  const params = req.body;
  try {
    // Assuming the Bearer token is sent in the Authorization header
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const result = await ExcludeWords.destroy({
      where: {
        id: params.sel_id
      }
    });
    console.log('Row deleted:', result);

    res.json({ result });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error processing token' });
  }
})
router.post('/excludewordsseldel', async function (req, res, next) {
  const params = req.body;

  try {
    // Assuming the Bearer token is sent in the Authorization header
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const result = await ExcludeWords.destroy({
      where: {
        id: params.sels
      }
    });
    console.log('Row deleted:', result);

    res.json({ result });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error processing token' });
  }
})

router.post('/excludewordsalldel', async function (req, res, next) {
  const params = req.body;

  try {
    // Assuming the Bearer token is sent in the Authorization header
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const result = await ExcludeWords.destroy({
      where: {
        user_id: params.user_id
      }
    });

    console.log('Row deleted:', result);

    res.json({ result });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error processing token' });
  }
})

router.post('/excludewordsadd', async function (req, res, next) {
  const params = req.body;
  try {
    // Assuming the Bearer token is sent in the Authorization header
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }
    const params = convertToArray_(req.body.asin);

    for (const item of params) {
      await ExcludeWords.create({ word: item, user_id: req.body.user_id });
    }

    res.json({ params });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error processing token' });
  }
})
//=============================================================
//  設定管理 / 価格設定
//=============================================================
router.post('/getpriceedit', async function (req, res, next) {
  const params = req.body;
  try {
    // Assuming the Bearer token is sent in the Authorization header
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const decoded = jwt.verify(token, config.secret);
    const email = decoded.email;

    const userinfo = await User.findAll({
      where: { email: email } 
    });

    const editprice = await EditPrice.findAll({
      where: { user_id: params.userId },
      order: [['in_price', 'ASC']]
    });

    res.json({
      editprice: editprice,
      userinfo: userinfo
    });


  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error processing token' });
  }
})
router.post('/priceeditadd', async function (req, res, next) {
  const params = req.body;
  try {
    // Assuming the Bearer token is sent in the Authorization header
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }
    const params = req.body;

    let editprice = new EditPrice
    editprice.user_id = params.user_id;
    editprice.in_price = params.in_price * 1;
    editprice.add_pro = params.add_pro * 1;
    editprice.add_price = params.add_price * 1;

    editprice.save();

    res.json({ editprice });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error processing token' });
  }
})

router.post('/priceeditdel', async function (req, res, next) {
  const params = req.body;
  try {
    // Assuming the Bearer token is sent in the Authorization header
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const result = await EditPrice.destroy({
      where: {
        id: params.sel_id
      }
    });
    console.log('Row deleted:', result);

    res.json({ result });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error processing token' });
  }
})

router.post('/priceeditseldel', async function (req, res, next) {
  const params = req.body;

  try {
    // Assuming the Bearer token is sent in the Authorization header
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const result = await EditPrice.destroy({
      where: {
        id: params.sels
      }
    });
    console.log('Row deleted:', result);

    res.json({ result });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error processing token' });
  }
})
router.post('/priceeditupdate', async function (req, res, next) {
  const params = req.body;
  try {
    // Assuming the Bearer token is sent in the Authorization header
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      let editprice = new EditPrice
      editprice.user_id = params.user_id;
      editprice.in_price = params.in_price;
      editprice.add_pro = params.add_pro;
      editprice.add_price = params.add_price;

      editprice.save();
    }
    const params = req.body;

    await EditPrice.findOne({ where: { id: params.sel_id } })
      .then(editprice => {
        if (!editprice) {
          return res.status(401).json({ message: 'No token provided' });

        } else {

          editprice.user_id = params.user_id;
          editprice.in_price = params.in_price;
          editprice.add_pro = params.add_pro;
          editprice.add_price = params.add_price;

          editprice.save();

          res.json({ editprice });

        }

      });


  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error processing token' });
  }
})
module.exports = router;