import { DataTypes, Model } from 'sequelize';
import sequelize from '../config';

interface LoanApplicationAttributes {
  id: number;
  applicantId: number;
  status: 'pending' | 'approved' | 'rejected';
  amount: number;
  term: number;
}

class LoanApplication
  extends Model<LoanApplicationAttributes>
  implements LoanApplicationAttributes
{
  public id!: number;
  public applicantId!: number;
  public status!: 'pending' | 'approved' | 'rejected';
  public amount!: number;
  public term!: number;
}

LoanApplication.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    applicantId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'User',
        key: 'id'
      }
    },
    status: {
      type: DataTypes.ENUM('pending', 'approved', 'rejected'),
      allowNull: false,
      defaultValue: 'pending'
    },
    amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    term: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  },
  {
    sequelize,
    modelName: 'LoanApplication'
  }
);

export default LoanApplication;
