import config from '../utils/config';
import moment, { Moment, Duration } from 'moment';
import * as utils from '../utils';
import * as btt from '../utils/btt';
import notifier, { NotificationMetadata } from 'node-notifier';
import * as boom from '@hapi/boom';
import * as icons from '../assets/icons';

type OneOfTickOptions =
  | { useBtt: boolean }
  | { notify: boolean }
  | { addTime: boolean }
  | { title: string }
  | { message: string }
  | { offsetDur: Duration };

class TickOptions extends Object {
  offsetDur: Duration;
  useBtt: boolean;
  notify: boolean;
  title: string;
  message: string;
  static formatMessage = (totDur?: Duration) => {
    return totDur ? `${utils.formatDur(totDur)} timer finished. ` : `Timer finished. `;
  };

  constructor(totDur?: moment.Duration) {
    super();
    this.offsetDur = moment.duration();
    this.useBtt = config.get('useBtt') as boolean;
    this.notify = config.get('notify') as boolean;
    this.title = `Time's up!`;
    this.message = TickOptions.formatMessage(totDur);
  }

  update = (options: OneOfTickOptions) => {
    Object.assign(this, options);
  };
}

class BarTimer {
  protected _startTime: Moment;
  protected _recentStartTime: Moment;
  protected _pausedElapsedDur: Duration;
  protected _totDur: Duration;
  protected intervalMs: number;
  protected intervalObj: NodeJS.Timeout;
  protected status: 'active' | 'paused' | 'idle';
  protected tickOptions: TickOptions;

  constructor() {
    this.tickOptions = new TickOptions();
    this._totDur = moment.duration();
    this._pausedElapsedDur = moment.duration();
    this._recentStartTime = this._startTime = moment();
    this.status = 'idle';
    this.reset({ anew: true });
  }

  updateOptions = (options: OneOfTickOptions) => {
    this.tickOptions.update(options);
    this.tickOptions.message = TickOptions.formatMessage(this.totDur);
  };

  resetOptions = (totDur?: Duration) => {
    this.tickOptions = new TickOptions(totDur);
  };

  get totDur() {
    return this._totDur.clone();
  }

  set totDur(dur) {
    this._totDur = dur;
  }

  get pausedElapsedDur() {
    return this._pausedElapsedDur.clone();
  }

  set pausedElapsedDur(dur) {
    this._pausedElapsedDur = dur;
  }

  get totMs() {
    return this._totDur.asMilliseconds();
  }

  get startMoment() {
    return this._startTime.clone();
  }

  set startMoment(startTime) {
    if (this.status !== 'idle') {
      throw this.statusError;
    }
    this._startTime = startTime;
  }

  get recentStartMoment() {
    return this._recentStartTime.clone();
  }

  set recentStartMoment(recentStartTime) {
    // only cases where recentStartMoment would be set are
    // 1. paused -> active
    // 2. idle -> active
    if (this.status === 'active') {
      throw boom.badRequest('A timer is active.');
    }
    this._recentStartTime = recentStartTime;
  }

  protected formatBar = (totChar: number, totDur: Duration, elapsedDur: Duration): string => {
    const remDur = totDur.clone().subtract(elapsedDur);
    const remSec = remDur.as('seconds');
    const totSec = totDur.as('seconds');
    const remPerc = remSec / totSec;
    const remChar = Math.ceil(totChar * remPerc);
    const passedChar = totChar - remChar;
    // const remPercStr = (remPerc * 100).toFixed(0).concat('%');
    const remTimeStr = utils.formatDur(remDur);
    const totTimeStr = utils.formatDur(totDur);
    const passedStr = '▁'.repeat(passedChar);
    const remStr = '█'.repeat(remChar);
    const str = `｜${remStr}${passedStr}｜${remTimeStr}｜${totTimeStr}｜`;
    return str;
  };

  protected end = async (notify = this.tickOptions.notify) => {
    const { title, message } = this.tickOptions;
    await this.reset({ anew: true });
    if (notify) {
      const notif = { title, message };
      utils.notify(notif);
    }
    return;
  };

  protected tick = async (char: number): Promise<void> => {
    const { useBtt } = this.tickOptions;
    const { totDur } = this;
    // elapsedDur is the duration between now and the most recent start
    // plus pausedElapsedDur -- what's left over from previous runs
    const elapsedDur = this.pausedElapsedDur.add(moment.duration(moment().diff(this.recentStartMoment)));
    if (elapsedDur > totDur) {
      await this.end();
    } else {
      const bar = this.formatBar(char, totDur, elapsedDur);
      if (useBtt) await btt.sendToBTT({ text: bar });
    }
  };

  protected updateBar = async (options?: OneOfTickOptions & { anew: boolean }): Promise<void> => {
    const { anew, ...tickOptions } = options;
    const totChar = config.get('barLength') as number;
    const charInterval = Math.ceil(this.totMs / totChar);
    const refreshInterval = (config.get('refreshRate') as number) * 1000;
    const interval = Math.min(charInterval, refreshInterval);
    const tock = () => this.tick(totChar);
    await this.reset({ anew });
    this.updateOptions(tickOptions);
    tock();
    this.setTimerInterval(tock, interval);
    return;
  };

  setTimerInterval = (callback: (...args: any[]) => void, interval: number) => {
    this.clearTimerInterval();
    this.intervalObj = setInterval(callback, interval);
    this.intervalMs = interval;
  };

  clearTimerInterval = () => {
    if (this.intervalObj) {
      clearInterval(this.intervalObj);
    }
  };

  reset = async ({ anew = true }): Promise<void> => {
    this.clearTimerInterval();
    if (this.tickOptions.useBtt) await btt.resetBTT();
    this.status = 'idle';
    if (anew) {
      this.tickOptions = new TickOptions();
      // everything else will be reset at next start
      this.pausedElapsedDur = moment.duration();
    }
  };

  start = async (dur?: string, options?: OneOfTickOptions | {}) => {
    if (this.status === 'idle') {
      const durStr = dur || (config.get('defaultDuration') as string);
      this.totDur = utils.parseTime(durStr);
      this.startMoment = moment();
      this.recentStartMoment = this.startMoment.clone();

      const res = await this.updateBar({ ...options, offsetDur: moment.duration(), anew: true });
      this.status = 'active';
      if (this.tickOptions.notify) {
        utils.notify({ title: `Timer set!`, message: `${durStr} countdown.` });
      }
      return res;
    } else {
      // timer is paused or active
      const error = this.statusError;
      error.message += 'Please stop the timer before starting another one. ';
      throw error;
    }
  };

  pause = async () => {
    if (this.status === 'active') {
      const elapsedDur = moment.duration(moment().diff(this.recentStartMoment)).add(this.pausedElapsedDur);
      this.clearTimerInterval();
      this.pausedElapsedDur = elapsedDur;
      this.status = 'paused';
      if (this.tickOptions.useBtt) {
        btt.sendToBTT({ iconData: icons.pausedIcon });
      }
    } else {
      throw boom.badRequest('No timer to pause.');
    }
  };

  resume = async () => {
    if (this.status === 'paused') {
      this.recentStartMoment = moment();
      await this.updateBar({ offsetDur: this.pausedElapsedDur, anew: false });
      this.status = 'active';
    } else {
      throw boom.badRequest('No timer to resume.');
    }
  };

  stop = async () => {
    if (this.status !== 'idle') {
      const notify = false;
      await this.end(notify);
    } else {
      throw boom.badRequest('No timer to stop.');
    }
  };

  toggle = async () => {
    switch (this.status) {
      case 'paused':
        await this.resume();
        return 'resumed';
      case 'active':
        await this.pause();
        return 'paused';
      case 'idle':
        await this.start();
        return 'started';
    }
  };

  get statusError() {
    return boom.badRequest(`Timer is ${this.status}. `);
  }
}

export default BarTimer;
