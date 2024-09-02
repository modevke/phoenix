import { Transaction } from "sequelize";
import { Command } from ".";
import { CommandResponses } from "../global";
import db from "../utils/db";
import { UserAttributes } from "../utils/db/models/user.entity";

export class CreateModelCommand implements Command {
  userAttributes: UserAttributes;
  transaction?: Transaction;
  model: string;

  constructor(model: string, userAttributes: any, t?: Transaction) {
    this.model = model;
    this.transaction = t;
    this.userAttributes = userAttributes;
  }

  async execute(): Promise<CommandResponses> {
    try {
      let opts = {};
      if (this.transaction) {
        opts["transaction"] = this.transaction;
      }
      const data = await db[this.model].create(this.userAttributes, opts);
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
  transaction?: Transaction;
  options?: any;
  model: string;

  constructor(model: string, options?: any, t?: Transaction) {
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
        opts = { ...opts, ...this.options };
      }
      const data = await db[this.model].findOne(opts);
      return {
        continue: true,
        error: false,
        data: data.dataValues,
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

  constructor(model: string, options?: any, t?: Transaction) {
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
        opts = { ...opts, ...this.options };
      }
      let data = await db[this.model].findAll(opts);

      return {
        continue: true,
        error: false,
        data: data.dataValues,
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

export class UpdateModelCommand implements Command {
  transaction: Transaction;
  model: string;
  modelAttributes: any;
  options: any = {};

  constructor(
    model: string,
    modelAttributes: any,
    options?: any,
    t?: Transaction
  ) {
    this.model = model;
    this.transaction = t;
    this.modelAttributes = modelAttributes;
    this.options = options;
  }

  async execute(): Promise<CommandResponses> {
    try {
      if (this.transaction) {
        this.options["transaction"] = this.transaction;
      }
      this.options["individualHooks"] = true

      const data = await db[this.model].update(
        this.modelAttributes,
        this.options
      );

      return {
        error: false,
        continue: true,
        res: data,
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

export class DeleteModelCommand implements Command {
  model: string;
  modelAttributes: any;
  t?: Transaction
  constructor(model: string, modelAttributes: any, t?: Transaction) {
    this.modelAttributes = modelAttributes;
    this.t = t
    this.model = model
  }

  async execute(): Promise<CommandResponses> {
    try {

      const opts = {
        where: this.modelAttributes
      }
      if (this.t) {
        opts["transaction"] = this.t;
      }

      const data = await db[this.model].destroy(
        opts
      );

      return {
        error: false,
        continue: true,
        res: data,
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
