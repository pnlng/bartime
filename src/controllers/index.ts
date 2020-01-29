import { Response, Request } from 'express';
import { Timer } from '../server';
import config, { schema as configSchema } from '../utils/config';
import * as boom from '@hapi/boom';
import fromEntries from 'object.fromentries';

export const start = async (req: Request, res: Response): Promise<Response> => {
  const { time } = req.params;
  await Timer.start(time, req.query);
  return res.send({ message: `Timer set: ${time}.` });
};

export const pause = async (_: Request, res: Response): Promise<Response> => {
  await Timer.pause();
  return res.send({ message: 'Timer paused.' });
};

export const resume = async (_: Request, res: Response) => {
  await Timer.resume();
  res.send({ message: 'Timer resumed.' });
};

export const stop = async (_: Request, res: Response) => {
  await Timer.stop();
  res.send({ message: 'Timer stopped.' });
};

export const toggle = async (_: Request, res: Response) => {
  const action = await Timer.toggle();
  res.send({ message: `Timer ${action}.` });
};

export const getDefaultText = (_: Request, res: Response) => {
  const text = config.get('defaultText') as string;
  res.send(text);
};

export const setConfig = (req: Request, res: Response) => {
  try {
    const fieldValPairs = req.query;
    const fields = Object.keys(fieldValPairs);
    const fieldInSchema = (x: string) => Object.keys(configSchema).includes(x);
    fields.filter(fieldInSchema).forEach((field) => {
      // @ts-ignore: Argument of type 'string' is not assignable to parameter of type...
      config.set(field, fieldValPairs[field]);
    });
    res.send({ message: 'Configurations set. ' });
  } catch (e) {
    throw boom.badRequest(e.message);
  }
};

export const getConfig = (_: Request, res: Response) => {
  const fields = Object.keys(configSchema);
  // @ts-ignore
  const currentConfigs = fromEntries(fields.map((x) => [ x, { value: config.get(x), ...configSchema[x] } ]));
  res.send(currentConfigs);
};
