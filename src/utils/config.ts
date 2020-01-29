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

export type ConfigField = keyof typeof schema;

export const schema = {
  uuid: {
    type: 'string' as 'string',
    format: 'uuid' as 'uuid',
    default: ''
  },
  bttSecret: {
    type: 'string' as 'string',
    default: ''
  },
  port: {
    type: 'number' as 'number',
    default: Number(process.env.PORT) || 4975,
    minimum: 1,
    maximum: 65535
  },
  entryPoint: {
    type: 'string' as 'string',
    format: 'uri' as 'uri',
    default: `http://localhost:${this.port}/bartime`
  },
  barLength: {
    type: 'number' as 'number',
    mininum: 1,
    default: 10
  },
  useBtt: {
    type: 'boolean' as 'boolean',
    default: true
  },
  notify: {
    type: 'boolean' as 'boolean',
    default: true
  },
  notifySound: {
    type: 'boolean' as 'boolean',
    default: true
  },
  defaultText: {
    type: 'string' as 'string',
    default: '15m'
  },
  defaultDuration: {
    type: 'string' as 'string',
    default: '15m'
  },
  refreshRate: {
    type: 'number' as 'number',
    default: 10
  }
};
const config = new Conf({ schema, projectName: 'bartime' });

export default config;
