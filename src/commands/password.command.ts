import { Command } from ".";
import { CommandResponses } from "../global";
import bcrypt from "bcrypt-nodejs";
import config from "config";
import { OperationalOptions } from "../global";

const { maxLogInAttempts } = config.get<OperationalOptions>(
  "serverConfigs.operational"
);

export class PasswordVerifyCommand implements Command {
  password: string;
  hashedPassword: string;
  loginAttempts: number;

  constructor(password: string, hashedPassword: string, loginAttempts: number) {
    this.hashedPassword = hashedPassword;
    this.password = password;
    this.loginAttempts = loginAttempts;
  }

  execute(): CommandResponses {
    let passwordIsValid = false;
    try {
      passwordIsValid = bcrypt.compareSync(this.password, this.hashedPassword);

      if (!passwordIsValid) {
        throw new Error("Invalid Password");
      }

      return {
        error: true,
        continue: true,
      };
    } catch (error) {
      return {
        error: true,
        continue: false,
        message: `Invalid credentials (username, clientId, clientSecret, email or password`,
        errorCode: "API102",
        errorMessage:
          "Invalid username or password. Please try again. Error code API102",
        res: {
          login_attempts_remaining: maxLogInAttempts - this.loginAttempts,
        },
      };
    }
  }
}

export class PasswordHashCommand implements Command {
  password: string;

  constructor(password: string) {
    this.password = password;
  }

  execute(): CommandResponses {
    try {
      const salt = bcrypt.genSaltSync(10);
      return {
        error: true,
        continue: true,
        data: bcrypt.hashSync(this.password, salt),
      };
    } catch (error) {
      return {
        error: true,
        continue: false,
        message: "Failed to encrypt password",
        errorCode: "API102",
        errorMessage: "Failed to encrypt password",
      };
    }
  }
}
