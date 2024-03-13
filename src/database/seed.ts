import sequelize from './config';
import User from './models/User';
import Role from './models/Role';

async function seedDatabase() {
  await sequelize.sync({
    force: false, // Set force to true to drop and recreate tables
    alter: process.env.NODE_ENV === 'production' ? false : true // Automatically update the table to match the model in development
  });

  // Seed roles
  try {
    const roles = await Role.findAll();
    if (roles.length === 0) {
      await Role.bulkCreate([{ name: 'admin' }, { name: 'applicant' }]);
      console.log('Roles table has been seeded');
    }
  } catch (error) {
    console.error('Error seeding roles:', error);
  }

  // Seed users
  try {
    const users = await User.findAll();
    if (users.length === 0) {
      await User.bulkCreate([
        { username: 'admin', password: 'admin', roleId: 1 },
        { username: 'applicant', password: 'applicant', roleId: 2 }
      ]);
      console.log('Users table has been seeded');
    }
  } catch (error) {
    console.error('Error seeding users:', error);
  }
}

export default seedDatabase;
