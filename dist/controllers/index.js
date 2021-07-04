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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getConfig = exports.setConfig = exports.getDefaultText = exports.toggle = exports.stop = exports.resume = exports.pause = exports.start = void 0;
const server_1 = require("../server");
const config_1 = __importStar(require("../utils/config"));
const boom = __importStar(require("@hapi/boom"));
const start = async (req, res) => {
    const { time } = req.params;
    await server_1.Timer.start(time, req.query);
    return res.send({ message: `Timer set: ${time}.` });
};
exports.start = start;
const pause = async (_, res) => {
    await server_1.Timer.pause();
    return res.send({ message: 'Timer paused.' });
};
exports.pause = pause;
const resume = async (_, res) => {
    await server_1.Timer.resume();
    res.send({ message: 'Timer resumed.' });
};
exports.resume = resume;
const stop = async (_, res) => {
    await server_1.Timer.stop();
    res.send({ message: 'Timer stopped.' });
};
exports.stop = stop;
const toggle = async (_, res) => {
    const action = await server_1.Timer.toggle();
    res.send({ message: `Timer ${action}.` });
};
exports.toggle = toggle;
const getDefaultText = (_, res) => {
    const text = config_1.default.get('defaultText');
    res.send(text);
};
exports.getDefaultText = getDefaultText;
const setConfig = (req, res) => {
    try {
        const fieldValPairs = req.query;
        const fields = Object.keys(fieldValPairs);
        const fieldInSchema = (x) => Object.keys(config_1.schema).includes(x);
        fields.filter(fieldInSchema).forEach((field) => {
            config_1.default.set(field, fieldValPairs[field]);
        });
        res.send({ message: 'Configurations set. ' });
    }
    catch (e) {
        throw boom.badRequest(e.message);
    }
};
exports.setConfig = setConfig;
const getConfig = (_, res) => {
    const fields = Object.keys(config_1.schema);
    res.send(Object.fromEntries(fields.map((x) => [x, Object.assign({ value: config_1.default.get(x) }, config_1.schema[x])])));
};
exports.getConfig = getConfig;
//# sourceMappingURL=index.js.map