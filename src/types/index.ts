import { Request, Response, NextFunction } from 'express';
// eslint-disable-next-line no-unused-vars
import { Session } from 'express-session';

declare module 'express-session' {
  interface Session {
    userId: string;
    name: string;
    level: string;
  }
}

declare module 'express' {
  interface Request {
    user: string;
  }
}

declare module 'express' {
  interface Require {
    session: Session;
  }
}
