import { Request, Response } from "express";
import {
  CreateModelCommand,
  DeleteModelCommand,
  FetchAllModelCommand,
  FetchOneByParameterCommand,
  UpdateModelCommand,
} from "../../../commands/model.command";
import { optionsBuilder } from "../../../decorators/fetch.decorator";
import {
  PasswordHashCommand,
  PasswordVerifyCommand,
} from "../../../commands/password.command";
import { JWTCreateCommand } from "../../../commands/jwt.command";
import { ESBCommand } from "../../../commands/esb.command";
import db from "../../../utils/db";
import { TaskScheduler } from "../../../commands";
import { ArchiveUserRole } from "../../../strategies/archive-user-role";
import { ArchiveCustomerStrategy } from "../../../strategies/archive-user-role/archive-customer";

export class UserService {
  static async fetchManyUsers(req: Request, res: Response): Promise<any> {
    const options = optionsBuilder(req.query);
    const task = new FetchAllModelCommand("User", options);
    res.send(await task.execute());
  }

  static async fetchUserById(req: Request, res: Response) {
    req.query["search"] = `id:${req.body.id}`;
    const options = optionsBuilder(req.query);
    const task = new FetchOneByParameterCommand("User", options);
    res.send(await task.execute());
  }

  static async userSignIn(req: Request, res: Response) {
    // 1. CHECK AUTHENTICATION
    const fetchAuthentication = new FetchOneByParameterCommand(
      "Authentication",
      optionsBuilder({
        search: `identifier:${req.body.identifier}`,
        join: "User",
      })
    );
    const executeFetchAuthentication = await fetchAuthentication.execute();

    if (
      executeFetchAuthentication.error ||
      executeFetchAuthentication.data.user.active === "Inactive"
    ) {
      return res.status(400).send({
        error: true,
        status: 400,
        message: `User not found or deactivated`,
        errorCode: "API101",
        errorMessage: `The user detail have not been found or has been deactivated. Please check your login details. If this persists contact us on: ${process.env.SUPPORT} with the Code: API101`,
      });
    }

    // 2. VERIFY PASSWORD
    const verifyPassword = new PasswordVerifyCommand(
      req.body.password,
      executeFetchAuthentication.data.hashedPassword,
      executeFetchAuthentication.data.user.loginAttempts
    ).execute();
    if ((await verifyPassword).error) {
      return res.status(400).send(verifyPassword);
    }

    // 3. Generate a token
    const generateToken = new JWTCreateCommand({
      id: executeFetchAuthentication.data.user.id,
    }).execute();

    // 4. Send 200 Response
    res.send({
      error: false,
      res: {
        ...generateToken.data,
        userDetails: {
          id: executeFetchAuthentication.data.id,
          email: executeFetchAuthentication.data.email,
          firstName: executeFetchAuthentication.data.firstName,
          lastName: executeFetchAuthentication.data.lastName,
          phone: executeFetchAuthentication.data.phone,
        },
      },
    });

    // 5. CLEAR LOGIN ATTEMPTS
    new UpdateModelCommand(
      "User",
      { loginAttempts: 0 },
      { where: { id: executeFetchAuthentication.data.id } }
    ).execute();
  }

  static async verifyUserFromESB(req: Request, res: Response) {
    res.send(
      new ESBCommand({
        message_body: {
          IDNo: req.body.IDNo,
        },
        message_route: {
          request_type: "SelfServiceIndividualPoliciesIDNO",
          interface: "CUSTOMER_INFO",
        },
      }).execute()
    );
  }

  static async resetUserPassword(req: Request, res: Response) {
    // 2. FETCH AUTHS BELONGING TO USER
    const findOtpIdentifier = await new FetchOneByParameterCommand(
      "UserOtp",
      optionsBuilder({
        search: `identifier:${req.body.identifier}&code:${req.body.otp}&status:pending`,
        join: "User",
      })
    ).execute();

    if (!findOtpIdentifier.data) {
      return res.status(400).send({
        error: true,
        status: 400,
        message: `Invalid OTP`,
        errorCode: "API105",
        errorMessage:
          "You have entered an invalid OTP code, please enter again or generate a new one. Code: API105",
      });
    }

    // 2. RETURN IF USER IS NOT FOUND OR ACCOUNT IS INACTIVE
    if (!findOtpIdentifier.data.user || !findOtpIdentifier.data.user.active) {
      return res.status(400).send({
        error: true,
        status: 400,
        message: `User not found or deactivated`,
        errorCode: "API101",
        errorMessage: `The user detail have not been found or has been deactivated. Please check your login details. If this persists contact us on: ${process.env.SUPPORT} with the Code: API101`,
      });
    }

    // 3. UPDATE PASSWORD
    const hashedPwd = new PasswordHashCommand(req.body.password).execute();
    if (hashedPwd.error) {
      return res.status(400).send(hashedPwd);
    }

    // 4. UPDATE AUTH AND OTP TABLES
    const t = await db.sequelize.transaction();

    const updateOtP = await new UpdateModelCommand(
      "UserOtp",
      {
        status: "used",
      },
      {
        where: {
          userId: findOtpIdentifier.data.user.id,
        },
      },
      t
    ).execute();

    const updateAuths = await new UpdateModelCommand(
      "Authentication",
      {
        hashedPassword: hashedPwd.data,
      },
      {
        where: {
          userId: findOtpIdentifier.data.user.id,
        },
      },
      t
    ).execute();

    if (updateOtP.error || updateAuths.error) {
      t.rollback();
      return res.status(400).send({
        error: true,
        status: 400,
        message: `Failed to update password`,
        errorCode: "API101",
        errorMessage: `Failed to update password`,
      });
    }

    t.commit();
    res.send({
      error: false,
      message: "Password reset successfully",
    });
  }

  static async updateUser(req: Request, res: Response) {
    res.send(new UpdateModelCommand("User", req.body,{where: {id:req.params.id}}).execute())
  }

  static async deleteUser(req: Request, res: Response) {

    const uid = Number(req.params.id)


    // 1. FETCH RESPECTIVE USER ROLES
    const fetchUserRoles = await new FetchAllModelCommand("UsersRoles", optionsBuilder({
      search: `userId:${uid}`,
      join: "Role",
    })).execute()

    if(fetchUserRoles.error){
      return res.status(400).send(fetchUserRoles)
    }

    // 2. RESPOND TO REQUESTOR
    res.send({
      error: false,
      message: "Your request has been received. You will be notified once the process has been completed "
    })

    // 3. ARCHIVE THE RESPECTIVE USER ROLE DATA
    if(fetchUserRoles.data && fetchUserRoles.data.length > 0){
      const aur = new ArchiveUserRole()
      for(const ur of fetchUserRoles.data){
        if(ur.role.name === "Customer"){
          aur.addUrs(new ArchiveCustomerStrategy(uid))
        }
        if(ur.role.name === "Admin") {
          // TODO: Implement archive Admin
        }
        if(ur.role.name === "Agent") {
          // TODO: Implement archive Agent
        }
      }
      // TODO HADLE RESPONSE
      aur.run()
    }


    // 4. ARCHIVE USER INFORMATION
    const t = await db.sequelize.transaction()
    const scheduler = new TaskScheduler()
    scheduler.addTask(new DeleteModelCommand("Authentication", { where: { userId: uid } }, t))
    scheduler.addTask(new DeleteModelCommand("UsersRoles", { where: { userId: uid } }, t))
    scheduler.addTask(new DeleteModelCommand("UserOtp", { where: { userId: uid } }, t))
    scheduler.addTask(new DeleteModelCommand("Notification", { where: { userId: uid } }, t))
    scheduler.addTask(new DeleteModelCommand("User", { where: { id: uid } }, t))

    // HANDLE RESPONSE
    await scheduler.executeTasks()

    // 5. NOTIFY ALL THE RESPECTIVE PARTIES
    const fetchAuthentication = new CreateModelCommand("Notification", {
      message: "Account deleted for User x with the roles [x, y, z] has been deleted by Z at timestamp",
      status: "success",
      userId: req["user"].id
    })


  }
}
