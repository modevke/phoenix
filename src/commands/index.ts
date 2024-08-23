import { Transaction } from "sequelize";
import { CommandResponses } from "../global";

export interface Command {
  execute(): Promise<CommandResponses>;
}

export class TaskScheduler {
  private tasks: Array<Command> = []
  transaction: Transaction

  addTask(task: Command, transaction?: Transaction): void {
    this.transaction = transaction
    this.tasks.push(task)
  }

  async executeTasks(): Promise<any> {
    while(this.tasks.length > 0) {
      const task = this.tasks.shift();
      if(task) {
        const res = await task.execute();
        if(this.transaction && res.error && !res.continue) {
          this.transaction.rollback()
          return res
        }
      }
    }
    if(this.transaction) {
      this.transaction.commit()
    }
  }

}