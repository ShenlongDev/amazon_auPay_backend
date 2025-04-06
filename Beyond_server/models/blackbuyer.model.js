// ブラック購入者設定
module.exports = (sequelize, Sequelize) => {
  const blackbuyer = sequelize.define("BlackBuyer", {
   
    user_id: {
      type: Sequelize.STRING,
    },
    name: {
      type: Sequelize.STRING,
    },
    address: {
      type: Sequelize.STRING,
    },
    phone: {
      type: Sequelize.STRING,
    },
    email: {
      type: Sequelize.STRING,
    }
  },
    {
      timestamps: false
    });
  return blackbuyer;
};