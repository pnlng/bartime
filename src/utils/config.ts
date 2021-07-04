import Conf from 'conf';

export type NotificationSound =
  | boolean
  | 'Basso'
  | 'Blow'
  | 'Bottle'
  | 'Frog'
  | 'Funk'
  | 'Glass'
  | 'Hero'
  | 'Morse'
  | 'Ping'
  | 'Pop'
  | 'Purr'
  | 'Sosumi'
  | 'Submarine'
  | 'Tink';

export type ConfigField = keyof ConfSchema;

interface ConfSchema {
  uuid: string,
  bttSecret: string,
  port: number,
  barLength: number,
  useBtt: boolean,
  notify: boolean,
  notifySound: string | boolean,
  defaultText: string,
  defaultDuration: string,
  refreshRate: number
}

type FieldTypes = 'boolean' | 'string' | 'number'

export const schema: Record<keyof ConfSchema, {type: FieldTypes | FieldTypes[], default: unknown, minimum?: number, maximum?: number}> = {
  uuid: {
    type: 'string',
    default: ''
  },
  bttSecret: {
    type: 'string',
    default: ''
  },
  port: {
    type: 'number',
    default: parseInt(process.env.PORT) || 4975,
    minimum: 1,
    maximum: 65535
  },
  barLength: {
    type: 'number',
    minimum: 1,
    default: 10
  },
  useBtt: {
    type: 'boolean',
    default: true
  },
  notify: {
    type: 'boolean',
    default: true
  },
  notifySound: {
    type: ['string', 'boolean'],
    default: true
  },
  defaultText: {
    type: 'string',
    default: '15m'
  },
  defaultDuration: {
    type: 'string',
    default: '15m'
  },
  refreshRate: {
    type: 'number',
    default: 10
  }
};
const config = new Conf<ConfSchema>({ schema, projectName: 'bartime' });

export default config;
