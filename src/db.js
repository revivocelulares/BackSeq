require('dotenv').config();
const { Sequelize } = require('sequelize');
const fs = require('fs');
const path = require('path');

const sequelize = new Sequelize('postgres://ddgtzexdoamtzi:77725ff983fdc03b57e2b68721b4ea644df1e9598a7c3d598f115936b28b7724@ec2-44-194-92-192.compute-1.amazonaws.com:5432/d4mjv55hcavib9',
  {
    logging: false,
    native: false,
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    }
  }
)

sequelize
  .authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });

const basename = path.basename(__filename);

const modelDefiners = [];
fs.readdirSync(path.join(__dirname, '/models'))
  .filter((file) => (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js'))
  .forEach((file) => {
    modelDefiners.push(require(path.join(__dirname, '/models', file)));
  });
modelDefiners.forEach(model => model(sequelize));

const {
  Products,
  Category,
  Collection,
  ProductsCategories,
} = sequelize.models;

Products.belongsToMany(Category, { through: 'ProductsCategories' });
Category.belongsToMany(Products, { through: 'ProductsCategories' });

module.exports = {
  ...sequelize.models,
  conn: sequelize,
};