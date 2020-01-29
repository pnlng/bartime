import config, { NotificationSound } from './config';
import moment, { Duration, unitOfTime } from 'moment';
import prettyMs from 'pretty-ms';
import notifier from 'node-notifier';
import * as boom from '@hapi/boom';

export const parseTime = (str: string) => {
  const getNumUnit = function(chunk: string) {
    const groups = /(\d+)\s*(\w)/.exec(chunk);
    if (groups === null) {
      throw boom.badRequest(`${str} is malformed.`);
    }
    return { num: parseInt(groups[1]), unit: groups[2] };
  };
  const addDur = function({ num, unit }: { num: number; unit: unitOfTime.DurationConstructor }) {
    try {
      dur.add(num, unit);
      return;
    } catch (e) {
      console.error(e);
    }
  };
  const dur = moment.duration();
  // split at unit-digit boundary and parse each group
  const chunks = str.replace(/([A-z])\s*(\d+)/g, '$1 $2').split(' ').map(getNumUnit);
  chunks.map(addDur);
  return dur;
};

export interface Notification {
  title?: string;
  message: string;
  reply?: boolean | string;
  closeLabel?: string;
  sound?: boolean | NotificationSound;
  timeout?: boolean | number;
}

export const notify = (notification: Notification) => {
  const sound = config.get('notifySound') as NotificationSound;
  const defaultNotification = {
    sound,
    timeout: 20,
    closeLabel: 'Close'
  };
  const newNotification = { ...defaultNotification, ...notification };
  // console.log(newNotification);
  notifier.notify(newNotification, (e, _, __) => {
    if (e) console.error(e);
  });
  return;
};

export const notifyError = (e: Error) => {
  notify({ timeout: 5, title: 'Error!', message: e.message });
};

export const getErrorRes = (e: Error) => {
  return { Error: e.message };
};

export const formatDur = (dur: Duration, compact = false) => {
  const ms = dur.asMilliseconds();
  return prettyMs(ms, { compact: compact }).replace(/\s|~/g, '');
};
