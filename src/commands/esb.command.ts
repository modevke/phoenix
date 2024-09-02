import { Command } from ".";
import { CommandResponses, ESBOptions } from "../global";
import { ReqMaker } from "../utils/common/reqmaker";
import config from "config";
import { generate } from "generate-password";

const { url, apiUser, apiPassword } = config.get<ESBOptions>(
  "serverConfigs.operational.esb"
);

export class ESBCommand implements Command {
  payload: any;

  constructor(payload: any) {
    this.payload = payload;
  }

  async getToken(): Promise<CommandResponses> {
    try {
      const res = await ReqMaker.sendRequest({
        url,
        method: "POST",
        data: {
          message_validation: {
            api_user: apiUser,
            api_password: apiPassword,
          },
          message_route: {
            interface: "TOKEN",
          },
        },
      });

      const {
        error_code: errorCode,
        error_desc: { token },
      } = res.data;

      if (errorCode === "00") {
        return { error: false, continue: true, data: token };
      } else {
        return {
          error: true,
          continue: false,
          errorCode: "ESB104",
          errorMessage:
            "An error occurred connecting to one of our services. Please try again. Code: ESB104",
          message: "Failed to authenticate ESB token",
        };
      }
    } catch (error) {
      return {
        error: true,
        continue: false,
        errorCode: "ESB104",
        errorMessage:
          "An error occurred connecting to one of our services. Please try again. Code: ESB104",
        message: "Failed to authenticate ESB token",
      };
    }
  }

  async execute(): Promise<CommandResponses> {
    try {
      const token = await this.getToken();
      if (!token || token.error) return token;
      this.payload.message_route["external_ref_number"] = `${
        token.data.token
      }${generate({
        length: 5,
        numbers: true,
        lowercase: false,
        uppercase: false,
      })}`;
      const res = await ReqMaker.sendRequest({
        url,
        method: "POST",
        data: {
          message_validation: {
            api_user: apiUser,
            api_password: apiPassword,
            token: token.data.token,
          },
          ...this.payload,
        },
      });
      if (res.data.error_code !== "00") {
        return {
          error: true,
          continue: false,
          errorCode: "ESB105",
          errorMessage:
            "An error occurred getting a response from one of our services. Please try again. Code: ESB105",
          message: "ESB responded with an error",
          res: res.data,
        };
      }
      if (res.data.error_code == "00" && res.data.error_desc.length === 0) {
        return {
          error: false,
          continue: true,
          errorCode: "ESB106",
          errorMessage:
            "An error occurred getting a response from one of our services. Please try again. Code: ESB106",
          message: "ESB sent an empty response",
          res: res.data,
        };
      }
      return {
        error: false,
        continue: true,
        res: res.data,
        message: "ESB successful",
      };
    } catch (error) {
      if (error.errorCode === 101) {
        return {
          error: true,
          continue: false,
          errorCode: "ESB100",
          errorMessage:
            "A time out error occurred connecting to our service. Please try again. Code: ESB100",
          message: "ESB Server request timeout",
        };
      }
      if (error.errorCode === 102) {
        return {
          error: true,
          continue: false,
          errorCode: "ESB101",
          errorMessage: error.message,
          message: "Error forwarded from ESB",
        };
      }
      if (error.errorCode === 103) {
        return {
          error: true,
          continue: false,
          errorCode: "ESB102",
          errorMessage:
            "An error occurred connecting to our service. Please try again. Code: ESB102",
          message: "Failed to reach to ESB Server",
        };
      }
      if (error.errorCode === 104) {
        return {
          error: true,
          continue: false,
          errorCode: "ESB103",
          errorMessage:
            "An error occurred connecting to our service. Please try again. Code: ESB103",
          message: "UnIdentified HTTP Error",
        };
      }
    }
  }
}
