import { Command } from "..";
import { CommandResponses, MailOptions } from "../../global";
import { ReqMaker } from "../../utils/common/reqmaker";
import config from 'config';

const { url } = config.get<MailOptions>('serverConfigs.mail');

export class SendEmailCommand implements Command {
  private recipients: string | string[];
  private html: string;
  private subject: string;

  constructor(recipients: string | string[], html: string, subject: string) {
    this.recipients = recipients;
    this.html = html;
    this.subject = subject;
  }

  async execute(): Promise<CommandResponses> {
    try {
        const mail = await ReqMaker.sendRequest({
            url,
            method: "POST",
            data: {
                subject: this.subject,
                to: this.recipients,
                mailBody: this.html
            },
            headers: undefined,
            timeout: 0
        })
        return {
          continue: true,
            error: true,
            message: 'Email sent',
            data: mail
        }
    } catch (error) {
        return {
          continue: true,
            error: true,
            message: error.message
        }
    }
  }
}
