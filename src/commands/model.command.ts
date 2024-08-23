import { Transaction } from "sequelize";
import { Command } from ".";
import { CommandResponses } from "../global";
import db from "../utils/db";
import { UserAttributes } from "../utils/db/models/user.entity";

export class CreateCommand implements Command {
  userAttributes: UserAttributes;
  transaction: Transaction;

  constructor(userAttributes: UserAttributes, t: Transaction) {
    this.transaction = t;
    this.userAttributes = userAttributes;
  }

  async execute(): Promise<CommandResponses> {
    try {
      const data = await db.User.create(this.userAttributes);
      return {
        continue: true,
        error: false,
        data,
      };
    } catch (error) {
      return {
        continue: false,
        error: true,
        message: error.message,
      };
    }
  }
}

export class FetchOneByParameterCommand implements Command {
  transaction: Transaction;
  options?: any;
  model: string;

  constructor(model: string, t: Transaction,options?: any) {
    this.model = model;
    this.transaction = t;
    this.options = options;
  }

  async execute(): Promise<CommandResponses> {
    try {
      let opts = {};
      if (this.transaction) {
        opts["transaction"] = this.transaction;
      }
      if (this.options) {
        opts = { ...opts,  ...this.options}
      }
      const data = await db[this.model].findOne(opts);
      return {
        continue: true,
        error: false,
        data,
      };
    } catch (error) {
      return {
        continue: false,
        error: true,
        message: error.message,
      };
    }
  }
}

export class FetchAllModelCommand implements Command {
  transaction?: Transaction;
  options?: any;
  model: string;

  constructor(model: string, t?: Transaction, options?: any) {
    this.model = model;
    this.transaction = t;
    this.options = options;
  }

  async execute(): Promise<CommandResponses> {
    try {
      let opts = {};
      if (this.transaction) {
        opts["transaction"] = this.transaction;
      }
      if (this.options) {
        opts = { ...opts,  ...this.options}
      }
      let data = await db[this.model].findAll(opts)

      return {
        continue: true,
        error: false,
        data,
      };
    } catch (error) {
      return {
        continue: false,
        error: true,
        message: error.message,
      };
    }
  }
}
