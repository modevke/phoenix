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
  

export type AuthenticationAttributes = {
    id: number;
    identifier: string;
    identifierType: string;
    hashedPassword: string;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date;
};

type AuthenticationCreationAttributes = Optional<AuthenticationAttributes, "id">;

class Authentication extends Model<AuthenticationAttributes, AuthenticationCreationAttributes> {
    declare id: CreationOptional<number>;
    declare identifier: string;
    declare identifierType: string;
    declare hashedPassword: string;
    declare createdAt: CreationOptional<Date>;
    declare updatedAt: CreationOptional<Date>;
    declare deletedAt: Date | null;

    declare userId: ForeignKey<User['id']>;

    declare user?: NonAttribute<User>;

}


export function AuthenticationEntity(sequelize: Sequelize) {
    Authentication.init(
      {
        id: {
          type: DataTypes.INTEGER.UNSIGNED,
          autoIncrement: true,
          primaryKey: true,
        },
        identifier: {
          type: new DataTypes.STRING(128),
          allowNull: false,
        },
        identifierType: {
          type: new DataTypes.STRING(128),
          allowNull: false,
        },
        hashedPassword: {
          type: new DataTypes.STRING(128),
          allowNull: false,
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
        tableName: "authentication",
        sequelize,
        timestamps: true,
        paranoid: true
      }
    );
  
    return Authentication
  }
  