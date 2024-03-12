import { DataTypes, Model } from 'sequelize';
import sequelize from '../config';

interface RoleAttributes {
  id: number;
  name: string;
}

class Role extends Model<RoleAttributes> implements RoleAttributes {
  public id!: number;
  public name!: string;
}

Role.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    name: {
      type: DataTypes.ENUM('admin', 'applicant'),
      defaultValue: 'applicant',
      allowNull: false
    }
  },
  {
    sequelize,
    modelName: 'Role'
  }
);

export default Role;
