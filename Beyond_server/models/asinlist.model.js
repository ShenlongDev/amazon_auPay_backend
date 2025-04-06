// ブラック購入者設定
module.exports = (sequelize, Sequelize) => {
  const asinlist = sequelize.define("AsinList", {
   
    user_id: {
      type: Sequelize.STRING,
    },
    asin: {
      type: Sequelize.STRING,
    },  
    name: {
      type: Sequelize.TEXT,
    },   
    brand: {
      type: Sequelize.STRING,
    }, 
    price: {
      type: Sequelize.FLOAT,
    },   
    img: {
      type: Sequelize.TEXT,
    },  
    status: {
      type: Sequelize.STRING,
    },
    reg_date: {
      type: Sequelize.STRING,
    },  
    amazon_link: {
      type: Sequelize.STRING,
    }
  },
    {
      timestamps: false
    });
  return asinlist;
};