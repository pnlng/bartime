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
const config_1 = __importDefault(require("./config"));
const moment_1 = __importDefault(require("moment"));
const pretty_ms_1 = __importDefault(require("pretty-ms"));
const node_notifier_1 = __importDefault(require("node-notifier"));
const boom = __importStar(require("@hapi/boom"));
exports.parseTime = (str) => {
    const getNumUnit = function (chunk) {
        const groups = /(\d+)\s*(\w)/.exec(chunk);
        if (groups === null) {
            throw boom.badRequest(`${str} is malformed.`);
        }
        return { num: parseInt(groups[1]), unit: groups[2] };
    };
    const addDur = function ({ num, unit }) {
        try {
            dur.add(num, unit);
            return;
        }
        catch (e) {
            console.error(e);
        }
    };
    const dur = moment_1.default.duration();
    const chunks = str.replace(/([A-z])\s*(\d+)/g, '$1 $2').split(' ').map(getNumUnit);
    chunks.map(addDur);
    return dur;
};
exports.notify = (notification) => {
    const sound = config_1.default.get('notifySound');
    const defaultNotification = {
        sound,
        timeout: 20,
        closeLabel: 'Close'
    };
    const newNotification = { ...defaultNotification, ...notification };
    node_notifier_1.default.notify(newNotification, (e, _, __) => {
        if (e)
            console.error(e);
    });
    return;
};
exports.notifyError = (e) => {
    exports.notify({ timeout: 5, title: 'Error!', message: e.message });
};
exports.getErrorRes = (e) => {
    return { Error: e.message };
};
exports.formatDur = (dur, compact = false) => {
    const ms = dur.asMilliseconds();
    return pretty_ms_1.default(ms, { compact: compact }).replace(/\s|~/g, '');
};
//# sourceMappingURL=index.js.map