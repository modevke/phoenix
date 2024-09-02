import {
    CreationOptional,
    Model,
    Optional,
    Sequelize,
    DataTypes,
    ForeignKey,
    NonAttribute,
  } from "sequelize";
import { User } from "./user.entity";
  

export type UserOtpAttributes = {
    id: number;
    code: string;
    status: string;
    identifier: string;
    expiresAt: Date;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date;
};

type UserOtpCreationAttributes = Optional<UserOtpAttributes, "id">;

class UserOtp extends Model<UserOtpAttributes, UserOtpCreationAttributes> {
    declare id: CreationOptional<number>;
    declare code: string;
    declare status: string;
    declare identifier: string;
    declare createdAt: CreationOptional<Date>;
    declare updatedAt: CreationOptional<Date>;
    declare deletedAt: Date | null;
    declare expiresAt: Date | null;

    declare userId: ForeignKey<User['id']>;

    declare user?: NonAttribute<User>;

}


export function UserOtpEntity(sequelize: Sequelize) {
    UserOtp.init(
      {
        id: {
          type: DataTypes.INTEGER.UNSIGNED,
          autoIncrement: true,
          primaryKey: true,
        },
        code: {
          type: new DataTypes.STRING(128),
          allowNull: false,
        },
        status: {
          type: new DataTypes.STRING(128),
          allowNull: false,
        },
        identifier: {
          type: new DataTypes.STRING(128),
          allowNull: false,
        },
        expiresAt: {
          field: "expires_at",
          type: DataTypes.DATE,
          allowNull: false,
          defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
        },
        createdAt: {
          field: "created_at",
          type: DataTypes.DATE,
          allowNull: false,
          defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
        },
        updatedAt: {
          field: "updated_at",
          type: DataTypes.DATE,
          allowNull: false,
          defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
        },
        deletedAt: {
          field: "deleted_at",
          type: DataTypes.DATE,
          allowNull: true,
        },
      },
      {
        tableName: "user_otp",
        sequelize,
        timestamps: true,
        paranoid: true
      }
    );
  
    return UserOtp
  }
  