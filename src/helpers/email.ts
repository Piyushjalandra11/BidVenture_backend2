import nodemailer from 'nodemailer';
import logger from './logger';
import SMTPTransport from 'nodemailer/lib/smtp-transport';
import Transporter from 'nodemailer/lib/mailer/index';
import { config } from '../config';

export type SendEmailPayload = {
  receiver: string;
  subject: string;
  text?: string;
  html?: string;
};

async function sendEmail(data: SendEmailPayload): Promise<boolean> {
  let isEmailSent = true;
  let transporter: Transporter<SMTPTransport.SentMessageInfo>;

  try {
    if (!data.text && !data.html) {
      logger.error('Email content missing (text/html)');
      return false;
    }

    transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: config.MAIL_USERNAME,
        pass: config.MAIL_PASSWORD,
      },
    });

    await transporter.sendMail({
      from: `${config.MAIL_DISPLAY_NAME} <${config.MAIL_FROM}>`,
      to: data.receiver,
      subject: data.subject,
      html: data.html,
      text: data.text,
    });
    logger.info(`Email sent to ${data.receiver}`);
  } catch (error) {
    logger.error(`Error sending email: ${error}`);
    isEmailSent = false;
  } finally {
    // @ts-ignore
    if (transporter !== undefined) {
      transporter.close();
    }
  }
  return isEmailSent;
}

export default { sendEmail };
