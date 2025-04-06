// ブラック購入者設定
module.exports = (sequelize, Sequelize) => {
  const excludewords = sequelize.define("ExcludeWords", {   
    user_id: {
      type: Sequelize.STRING,
    },
    word: {
      type: Sequelize.STRING,
    },   
  },
    {
      timestamps: false
    });
  return excludewords;
};