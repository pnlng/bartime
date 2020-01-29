"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const server_1 = require("../server");
const config_1 = __importStar(require("../utils/config"));
const boom = __importStar(require("@hapi/boom"));
const object_fromentries_1 = __importDefault(require("object.fromentries"));
exports.start = async (req, res) => {
    const { time } = req.params;
    await server_1.Timer.start(time, req.query);
    return res.send({ message: `Timer set: ${time}.` });
};
exports.pause = async (_, res) => {
    await server_1.Timer.pause();
    return res.send({ message: 'Timer paused.' });
};
exports.resume = async (_, res) => {
    await server_1.Timer.resume();
    res.send({ message: 'Timer resumed.' });
};
exports.stop = async (_, res) => {
    await server_1.Timer.stop();
    res.send({ message: 'Timer stopped.' });
};
exports.toggle = async (_, res) => {
    const action = await server_1.Timer.toggle();
    res.send({ message: `Timer ${action}.` });
};
exports.getDefaultText = (_, res) => {
    const text = config_1.default.get('defaultText');
    res.send(text);
};
exports.setConfig = (req, res) => {
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
exports.getConfig = (_, res) => {
    const fields = Object.keys(config_1.schema);
    const currentConfigs = object_fromentries_1.default(fields.map((x) => [x, { value: config_1.default.get(x), ...config_1.schema[x] }]));
    res.send(currentConfigs);
};
//# sourceMappingURL=index.js.map