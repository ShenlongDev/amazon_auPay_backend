// ブラック購入者設定
module.exports = (sequelize, Sequelize) => {
  const whiteasin = sequelize.define("WhiteAsin", {
   
    user_id: {
      type: Sequelize.STRING,
    },
    asin: {
      type: Sequelize.STRING,
    },   
  },
    {
      timestamps: false
    });
  return whiteasin;
};