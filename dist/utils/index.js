"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatDur = exports.getErrorRes = exports.notifyError = exports.notify = exports.parseTime = void 0;
const config_1 = __importDefault(require("./config"));
const moment_1 = __importDefault(require("moment"));
const pretty_ms_1 = __importDefault(require("pretty-ms"));
const node_notifier_1 = __importDefault(require("node-notifier"));
const boom = __importStar(require("@hapi/boom"));
const parseTime = (str) => {
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
exports.parseTime = parseTime;
const notify = (notification) => {
    const sound = config_1.default.get('notifySound');
    const defaultNotification = {
        sound,
        timeout: 20,
        closeLabel: 'Close'
    };
    const newNotification = Object.assign(Object.assign({}, defaultNotification), notification);
    node_notifier_1.default.notify(newNotification, e => {
        if (e)
            console.error(e);
    });
    return;
};
exports.notify = notify;
const notifyError = (e) => {
    exports.notify({ timeout: 5, title: 'Error!', message: e.message });
};
exports.notifyError = notifyError;
const getErrorRes = (e) => {
    return { Error: e.message };
};
exports.getErrorRes = getErrorRes;
const formatDur = (dur, compact = false) => {
    const ms = dur.asMilliseconds();
    return pretty_ms_1.default(ms, { compact: compact }).replace(/\s|~/g, '');
};
exports.formatDur = formatDur;
//# sourceMappingURL=index.js.map