"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = __importDefault(require("../utils/config"));
const moment_1 = __importDefault(require("moment"));
const utils = __importStar(require("../utils"));
const btt = __importStar(require("../utils/btt"));
const boom = __importStar(require("@hapi/boom"));
const icons = __importStar(require("../assets/icons"));
class TickOptions extends Object {
    constructor(totDur) {
        super();
        this.update = (options) => {
            Object.assign(this, options);
        };
        this.offsetDur = moment_1.default.duration();
        this.useBtt = config_1.default.get('useBtt');
        this.notify = config_1.default.get('notify');
        this.askAddTime = config_1.default.get('askAddTime');
        this.title = `Time's up!`;
        this.message = TickOptions.formatMessage(totDur);
    }
}
TickOptions.formatMessage = (totDur) => {
    return totDur ? `${utils.formatDur(totDur)} timer finished. ` : `Timer finished. `;
};
class BarTimer {
    constructor() {
        this.updateOptions = (options) => {
            this.tickOptions.update(options);
            this.tickOptions.message = TickOptions.formatMessage(this.totDur);
        };
        this.resetOptions = (totDur) => {
            this.tickOptions = new TickOptions(totDur);
        };
        this.formatBar = (totChar, totDur, elapsedDur) => {
            const remDur = totDur.clone().subtract(elapsedDur);
            const remSec = remDur.as('seconds');
            const totSec = totDur.as('seconds');
            const remPerc = remSec / totSec;
            const remChar = Math.ceil(totChar * remPerc);
            const passedChar = totChar - remChar;
            const remTimeStr = utils.formatDur(remDur);
            const totTimeStr = utils.formatDur(totDur);
            const passedStr = '▁'.repeat(passedChar);
            const remStr = '█'.repeat(remChar);
            const str = `｜${remStr}${passedStr}｜${remTimeStr}｜${totTimeStr}｜`;
            return str;
        };
        this.end = async (askAddTime = this.tickOptions.askAddTime) => {
            const notifCloseLabel = 'Close';
            const { notify, title, message } = this.tickOptions;
            await this.reset({ anew: true });
            if (notify) {
                let notif;
                notif = { title, message };
                utils.notify(notif);
            }
            return;
        };
        this.tick = async (char) => {
            const { useBtt } = this.tickOptions;
            const { totDur } = this;
            const elapsedDur = this.pausedElapsedDur.add(moment_1.default.duration(moment_1.default().diff(this.recentStartMoment)));
            if (elapsedDur > totDur) {
                await this.end();
            }
            else {
                const bar = this.formatBar(char, totDur, elapsedDur);
                if (useBtt)
                    await btt.sendToBTT({ text: bar });
            }
        };
        this.updateBar = async (options) => {
            const { anew, ...tickOptions } = options;
            const totChar = config_1.default.get('barLength');
            const charInterval = Math.ceil(this.totMs / totChar);
            const refreshInterval = config_1.default.get('refreshRate') * 1000;
            const interval = Math.min(charInterval, refreshInterval);
            const tock = () => this.tick(totChar);
            await this.reset({ anew });
            this.updateOptions(tickOptions);
            tock();
            this.setTimerInterval(tock, interval);
            return;
        };
        this.setTimerInterval = (callback, interval) => {
            this.clearTimerInterval();
            this.intervalObj = setInterval(callback, interval);
            this.intervalMs = interval;
        };
        this.clearTimerInterval = () => {
            if (this.intervalObj) {
                clearInterval(this.intervalObj);
            }
        };
        this.reset = async ({ anew = true }) => {
            this.clearTimerInterval();
            if (this.tickOptions.useBtt)
                await btt.resetBTT();
            this.status = 'idle';
            if (anew) {
                this.tickOptions = new TickOptions();
                this.pausedElapsedDur = moment_1.default.duration();
            }
        };
        this.start = async (dur, options) => {
            if (this.status === 'idle') {
                const durStr = dur || config_1.default.get('defaultDuration');
                this.totDur = utils.parseTime(durStr);
                this.startMoment = moment_1.default();
                this.recentStartMoment = this.startMoment.clone();
                const res = await this.updateBar({ ...options, offsetDur: moment_1.default.duration(), anew: true });
                this.status = 'active';
                if (this.tickOptions.notify) {
                    utils.notify({ title: `Timer set!`, message: `${durStr} countdown.` });
                }
                return res;
            }
            else {
                const error = this.statusError;
                error.message += 'Please stop the timer before starting another one. ';
                throw error;
            }
        };
        this.pause = async () => {
            if (this.status === 'active') {
                const elapsedDur = moment_1.default.duration(moment_1.default().diff(this.recentStartMoment)).add(this.pausedElapsedDur);
                this.clearTimerInterval();
                this.pausedElapsedDur = elapsedDur;
                this.status = 'paused';
                if (this.tickOptions.useBtt) {
                    btt.sendToBTT({ iconData: icons.pausedIcon });
                }
            }
            else {
                throw boom.badRequest('No timer to pause.');
            }
        };
        this.resume = async () => {
            if (this.status === 'paused') {
                this.recentStartMoment = moment_1.default();
                await this.updateBar({ offsetDur: this.pausedElapsedDur, anew: false });
                this.status = 'active';
            }
            else {
                throw boom.badRequest('No timer to resume.');
            }
        };
        this.stop = async () => {
            if (this.status !== 'idle') {
                const askAddTime = false;
                await this.end(askAddTime);
            }
            else {
                throw boom.badRequest('No timer to stop.');
            }
        };
        this.toggle = async () => {
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
        this.tickOptions = new TickOptions();
        this._totDur = moment_1.default.duration();
        this._pausedElapsedDur = moment_1.default.duration();
        this._recentStartTime = this._startTime = moment_1.default();
        this.status = 'idle';
        this.reset({ anew: true });
    }
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
        if (this.status === 'active') {
            throw boom.badRequest('A timer is active.');
        }
        this._recentStartTime = recentStartTime;
    }
    get statusError() {
        return boom.badRequest(`Timer is ${this.status}. `);
    }
}
exports.default = BarTimer;
//# sourceMappingURL=BarTimer.js.map