import { Request, Response, NextFunction, RequestHandler } from 'express';
import * as boom from '@hapi/boom';
import * as utils from '../utils';

export const asyncWrapper = (fn: RequestHandler) => (req: Request, res: Response, next: NextFunction) => {
  Promise.resolve(fn(req, res, next)).catch((e) => {
    if (!e.isBoom) return next(boom.badImplementation(e));
    next(e);
  });
};

export const log = (e: boom.Boom, _: Request, __: Response, next: NextFunction) => {
  console.error(e);
  next(e);
};

export const notify = (e: boom.Boom, _: Request, __: Response, next: NextFunction) => {
  utils.notifyError(e);
  next(e);
};

export const handler = (e: boom.Boom, _: Request, res: Response, __: NextFunction) => {
  return res.status(e.output.statusCode).json(e.output.payload);
};
