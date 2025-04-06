// ブラック購入者設定
module.exports = (sequelize, Sequelize) => {
  const editprice = sequelize.define("EditPrice", {
   
    user_id: {
      type: Sequelize.STRING,
    },
    in_price: {
      type: Sequelize.FLOAT,
    },   
    add_pro: {
      type: Sequelize.FLOAT,
    },   
    add_price: {
      type: Sequelize.FLOAT,
    }, 
  },
    {
      timestamps: false
    });
  return editprice;
};