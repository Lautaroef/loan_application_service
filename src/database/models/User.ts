import { DataTypes, Model } from 'sequelize';
import sequelize from '../config';
import Role from './Role';

interface UserAttributes {
  id: number;
  username: string;
  password: string;
  roleId: number;
}

class User extends Model<UserAttributes> implements UserAttributes {
  public id!: number; // ! avoids initialization check
  public username!: string;
  public password!: string;
  public roleId!: number;
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    username: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    roleId: {
      type: DataTypes.INTEGER,
      references: {
        model: Role,
        key: 'id'
      }
    }
  },
  {
    sequelize,
    modelName: 'User'
  }
);

export default User;
