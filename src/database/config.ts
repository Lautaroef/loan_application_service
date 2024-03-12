import { Sequelize } from 'sequelize';

const sequelize = new Sequelize('loan_company', process.env.DB_USER, process.env.DB_PASSWORD, {
  host: 'localhost',
  dialect: 'postgres',
  schema: 'public',
  logging: false
});

export default sequelize;
