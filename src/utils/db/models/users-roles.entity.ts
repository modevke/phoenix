import {
  CreationOptional,
  Model,
  Optional,
  Sequelize,
  DataTypes,
  ForeignKey,
} from "sequelize";
import { User } from "./user.entity";
import { Role } from "./role.entity";

export type UsersRolesAttributes = {
  id: number;
  userId: number;
  roleId: number;
  assignedBy: number;
  expiresAt: Date;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
};

type UsersRolesCreationAttributes = Optional<UsersRolesAttributes, "id">;

class UsersRoles extends Model<
  UsersRolesAttributes,
  UsersRolesCreationAttributes
> {
  declare id: CreationOptional<number>;
  declare userId: ForeignKey<User['id']>;;
  declare roleId: ForeignKey<Role['id']>;
  declare assignedBy: ForeignKey<User['id']>;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
  declare deletedAt: Date | null;
  declare expiresAt: Date | null;
}

export function UsersRolesEntity(sequelize: Sequelize) {
  UsersRoles.init(
    {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },
      userId: {
        field: "user_id",
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
      },
      roleId: {
        field: "role_id",
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
      },
      assignedBy: {
        field: "assigned_by",
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        defaultValue: false,
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
      tableName: "users_roles",
      sequelize,
      timestamps: true,
      paranoid: true,
    }
  );

  return UsersRoles;
}
