import { Request, Response } from "express";
import { FetchAllModelCommand, FetchOneByParameterCommand } from "../../../commands/model.command";
import { optionsBuilder } from "../../../utils/common/decorator/fetch.decorator";

export class UserService {
  static async fetchManyUsers(req: Request, res: Response): Promise<any> {
    const options = optionsBuilder(req.query);
    const task = new FetchAllModelCommand("User", null, options);
    res.send(await task.execute());
  }

  static async fetchUserById(req: Request, res: Response) {
    req.query["search"] = `id:${req.body.id}`
    const options = optionsBuilder(req.query);
    const task = new FetchOneByParameterCommand("User", null, options);
    res.send(await task.execute());
  }

  static async userSignIn(req: Request, res: Response) {

    const fetchAuthentication = new FetchOneByParameterCommand("Authentication", null, optionsBuilder({
        search: `identifier:${req.body.identifier}`,
        join: "User"
    }));


  }

  static async userCheckId(id: number) {}

  static async resetUserPassword(id: number) {}

  static async updateUser(id: number) {}

  static async deleteUser(id: number) {}
}
