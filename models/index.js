// const dbConfig = require("../configs/postgre-config");
const dbConfig = require("../configs/postgre-config");
const Sequelize = require("sequelize");
const sequelize = new Sequelize(dbConfig.database, dbConfig.username, dbConfig.password, dbConfig);
const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.User = require("./user.model.js")(sequelize, Sequelize);
db.BlackBuyer = require("./blackbuyer.model.js")(sequelize, Sequelize);
db.WhiteAsin =  require("./whiteasin.model.js")(sequelize, Sequelize);
db.ExcludeWords =  require("./excludewords.model.js")(sequelize, Sequelize);
db.EditPrice =  require("./editprice.model.js")(sequelize, Sequelize);
db.AsinList =  require("./asinlist.model.js")(sequelize, Sequelize);

module.exports = db;