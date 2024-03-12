import User from './User';
import Role from './Role';
import LoanApplication from './LoanApplication';

User.belongsTo(Role, { foreignKey: 'roleId', as: 'role' });
Role.hasMany(User, { foreignKey: 'roleId', as: 'users' });

User.hasMany(LoanApplication, { foreignKey: 'applicantId' });
LoanApplication.belongsTo(User, { foreignKey: 'applicantId' });

export { User, Role };
