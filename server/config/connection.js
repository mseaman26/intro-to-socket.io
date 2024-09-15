require('dotenv').config({ path: require('find-config')('.env') })
const Sequelize = require('sequelize');


let sequelize;

if (process.env.JAWSDB_URL) {
  sequelize = new Sequelize(process.env.JAWSDB_URL);
} else {
    //TODO: delete this console log (currently printing undefined)
    console.log('Loaded Environment Variables:', {
        DB_NAME: process.env.DB_NAME,
        DB_USER: process.env.DB_USER,
        DB_PASSWORD: process.env.DB_PASSWORD,
        JAWSDB_URL: process.env.JAWSDB_URL
      });
    sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
      host: 'localhost',
      dialect: 'mysql',
      port: 3306
    }
  );
}

module.exports = sequelize;
