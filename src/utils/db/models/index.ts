import { Sequelize } from "sequelize";
import { UserEntity } from "./user.entity";
import { AuthenticationEntity } from "./authentication.entity";
import { UserOtpEntity } from "./user-otp.entity";
import { RoleEntity } from "./role.entity";
import { UsersRolesEntity } from "./users-roles.entity";
import { NotificationEntity } from "./notification.entity";


export default function (sequelize: Sequelize) {
  const user = UserEntity(sequelize);
  const authentication = AuthenticationEntity(sequelize);
  const userOtp = UserOtpEntity(sequelize);
  const role = RoleEntity(sequelize);
  const usersRoles = UsersRolesEntity(sequelize);
  const notification = NotificationEntity(sequelize);

  // Authentication belongs to user
  authentication.belongsTo(user, { foreignKey: "user_id" });
  user.hasMany(authentication, { foreignKey: "user_id" });

  // userOtp belongs to user
  userOtp.belongsTo(user, { foreignKey: "user_id" });
  user.hasMany(userOtp, { foreignKey: "user_id" });

  // User belongsToMany roles through user_roles
  user.belongsToMany(role, { through: usersRoles, foreignKey: "user_id", as: "users" });
  user.belongsToMany(role, { through: usersRoles, foreignKey: "assigned_by", as: "assignees" });
  role.belongsToMany(user, { through: usersRoles, foreignKey: "role_id" });

    // Notification belongs to user
    notification.belongsTo(user, { foreignKey: "user_id" });
    user.hasMany(notification, { foreignKey: "user_id" });
  

  return {
    user,
    authentication,
    userOtp,
    role,
    notification,
    usersRoles
  };
}
