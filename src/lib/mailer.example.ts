import nodemailer from 'nodemailer';

const transport = nodemailer.createTransport({
  host: 'smtp.mailtrap.io',
  port: 2525,
  auth: {
    user: '45a69237130382',
    pass: '12e2bb627d9897',
  },
});

export default transport;
